# Backend & Infrastructure Plan

## 1. Objectives
- Обслуживать web PWA (и позже мобильных клиентов) с низкими задержками, офлайн-синхронизацией и безопасной выдачей пазлов.
- Поддерживать puzzle pipeline (batch генерация, random, daily, UGC) + LiveOps/события/монетизацию.
- Обеспечить масштабируемость (тысячи одновременных игроков, рост контента), observability и надёжность.

## 2. Service Architecture
| Сервис | Ответственность |
| --- | --- |
| **Gateway API** (NestJS/Go) | Auth, выдача паков/puzzle, прогресс, daily, UGC API, интеграции с платежами/рекламой.
| **Puzzle Service** (Rust worker + gRPC/CLI) | Генерация паков, random puzzle, solver scoring, подписи контента.
| **LiveOps/Config** | Расписание событий, feature flags, A/B-тесты (LaunchDarkly/Unleash + Firebase Remote Config).
| **UGC Service** | Хранение пользовательских пазлов, rate-limit, shareable URL, жалобы.
| **Payments/Billing** | Подписки, покупки паков, интеграция с Stripe/Apple/Google (для веб сначала Stripe).
| **Analytics/Events** | Логирование гейм-событий в ClickHouse/BigQuery + расчёт лидербордов/метрик.

## 3. Data Layer
- **PostgreSQL** (AWS Aurora / Cloud SQL):
  - `users`, `sessions`, `devices`.
  - `packs`, `puzzles`, `daily_schedule`, `events`, `leaderboards`.
  - `ugc_puzzles`, `ugc_votes`, `reports`.
  - `purchases`, `subscriptions`, `reward_history`.
- **Redis**: кэш паков, сессий, rate-limit, лидербордов.
- **S3/GCS**: хранение puzzle payloads (bitmask+clues), pack metadata, UGC экспортов.
- **Firestore/Firebase** (точечно): Crashlytics, Performance, FCM, Remote Config; основная авторизация/данные — в Postgres.
- **ClickHouse** (основной аналитический кластер) + экспорт в S3; при необходимости зеркалим агрегаты в BigQuery/Amplitude для маркетинга.

## 4. APIs & Flows
- `GET /packs`, `GET /packs/{id}`, `GET /puzzle/{id}` — выдача подписанных паков/пазлов.
- `POST /puzzle/random` — сервер генерирует или выдаёт кешированный random puzzle.
- `GET /daily` — текущий daily + прогресс, награды.
- `POST /progress` — сохранение state пазла (bitmask) + валидация.
- `GET /leaderboard` — батчевые лидерборды (обновляются каждые N минут, без WebSocket на MVP).
- `POST /ugc` — загрузка пользовательского пазла → backend валидирует через puzzle service, сохраняет, возвращает URL.
- `GET /community/{slug}` — получение UGC-пазла.
- `POST /purchase`, `POST /subscription/webhook` — монетизация.
- Internal: API для LiveOps (настройка событий, баннеров), админ-панель.

## 5. Infrastructure Stack
- **Cloud**: AWS (основной регион `eu-west-1`, мульти-AZ).  
  - Compute: Kubernetes (EKS) + autoscaling; puzzle workers запускаем как Rust-поды через SQS.  
  - Хранение: Aurora Postgres, ElastiCache Redis, S3, CloudFront для глобальной раздачи.  
  - Резерв: при необходимости read-replica в `us-east-1`, но full multi-region позже.  
- **IaC**: Terraform (VPC, EKS, Aurora, Redis, S3, CloudFront, SQS), Helm для деплоев.  
- **CI/CD**: GitHub Actions → build/test → Docker → deploy (ArgoCD/Helmfile).  
- **Observability**: OpenTelemetry + Prometheus/Grafana, Loki, Sentry.  
- **Security/Access**: IAM roles, Secrets Manager, WAF, CloudFront signed URLs.

## 6. LiveOps & Monetization
- События/баннеры конфигурируются через LaunchDarkly/Remote Config → frontend получает конфиг и ресурсы из CDN.
- Daily/seasonal расписания в Postgres, cron/CloudWatch events запускают job’ы по генерации и наградам.
- Реклама: сервер хранит настройки placement, веб-клиент интегрирует IMA/AdSense.
- Подписки/покупки — Stripe (web) с последующим расширением на мобильные стора.

## 7. Roadmap (Backend/Infra)
1. Подготовить Terraform/Helm модули (VPC, EKS, Aurora, Redis, S3, CloudFront).  
2. Реализовать Gateway API (auth, packs, progress, UGC).  
3. Развернуть puzzle service worker и pipeline (SQS jobs).  
4. Настроить LiveOps/feature flags, Remote Config.  
5. Подключить Stripe + базовую подписку.  
6. Наладить observability (logs/metrics/traces).  
7. Админ-панель (управление паков, событиями, UGC).  
8. Подготовить масштабирование (autoscaling, multi-AZ, бэкапы).

## 8. JSON payloads

### Pack & Puzzle summary
```ts
type PuzzleSummary = {
  id: string;
  name: string;
  size: string; // e.g. "5×5"
  difficulty: "Easy" | "Normal" | "Hard" | "Expert";
  status: "locked" | "available" | "completed";
};

type Pack = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Normal" | "Hard";
  badge: string;
  puzzles: PuzzleSummary[];
};
```
Example:
```json
{
  "id": "starter",
  "title": "Starter Pack",
  "description": "5×5 и 10×10 пазлы для быстрого старта.",
  "difficulty": "Easy",
  "badge": "🌱",
  "puzzles": [
    { "id": "s-1", "name": "Smiley", "size": "5×5", "difficulty": "Easy", "status": "completed" }
  ]
}
```

### Puzzle payload
```ts
type Puzzle = {
  id: string;
  name: string;
  size: number;
  rows: number[][];
  cols: number[][];
  solution: number[][]; // битовая матрица 0/1
  solvable: boolean; // серверная проверка
  reward?: { xp: number; tokens?: number };
};
```

### UserProgress
```ts
type UserProgress = {
  userId: string;
  puzzleId: string;
  packId?: string;
  gridState: string; // base64 bitmask или run-length
  mistakes: number;
  completed: boolean;
  updatedAt: string;
};
```

### UGC puzzle
```ts
type UGC = {
  id: string;
  slug: string;
  size: number;
  rows: number[][];
  cols: number[][];
  solvable: boolean;
  author: { id: string; nickname: string };
  votes: { up: number; down: number };
  createdAt: string;
};
```

## 9. Открытые вопросы
- Точные объёмы нагрузки для планирования кластеров (EKS, ClickHouse).  
- Требования по срокам disaster recovery / RTO-RPO.  
- Детали админ-панели (кто и какие операции должен иметь).  
- План расширения на мобильные стора (Stripe → Apple/Google) — ближе к запуску мобилок.
