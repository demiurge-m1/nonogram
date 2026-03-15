# Nonogram Gateway (NestJS)

Gateway API для веб-клиента: healthcheck, выдача паков и пазлов, готовность к дальнейшей интеграции (auth, прогресс, UGC, payments).

## 📦 Что уже есть
- NestJS 11 + TypeScript + ESLint/Prettier.
- `GET /healthz` — статус сервиса (ok/timestamp/commit).
- `GET /packs`, `GET /packs/:id` — кэшированные данные паков (синхронизированы с web-моками).
- `GET /puzzles/:id` — выдаёт сетку/подсказки для wasm solver’а.
- ConfigModule (`PORT`, `HOST`, `ALLOWED_ORIGINS`) + Validation (Joi).
- Dockerfile (multi-stage) и `docker-compose.yml` для локального запуска контейнера.

## API Docs
- Swagger UI: <http://localhost:3333/docs>.
- Экспорт схемы: `npm run swagger:json` → файл `docs/openapi.json`.


## 🚀 Быстрый старт
```bash
cd backend
npm install
npm run start:dev
```
Сервис слушает `http://localhost:3333` (переопределяется переменными окружения).

### Переменные окружения
Скопируй `.env.example` → `.env` или передай прямо в среду:
```
PORT=3333
HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.78:3000
```

### Docker
```bash
cd backend
docker compose up --build
```
Либо отдельно:
```bash
docker build -t nonogram-gateway ./backend
docker run -p 3333:3333 nonogram-gateway
```

## 🛣️ Endpoints
| Method | Path            | Описание                |
|--------|-----------------|------------------------|
| POST   | `/auth/guest`   | Создать гостевой токен |
| GET    | `/auth/profile` | Профиль текущей сессии |
| GET    | `/healthz`      | Health + commit hash   |
| GET    | `/packs`        | Список паков (+counts) |
| GET    | `/packs/:id`    | Полное описание пака   |
| GET    | `/puzzles/:id`  | Полные данные пазла    |

## 🧱 Структура
```
src/
 ├─ config/        # env loader + validation
 ├─ data/          # моковые packs/puzzles
 ├─ health/        # health controller/service
 ├─ packs/         # packs controller/service
 └─ puzzles/       # puzzles controller/service
```

## ✅ Скрипты
| Команда           | Назначение                      |
|-------------------|---------------------------------|
| `npm run start`   | запуск в prod-режиме            |
| `npm run start:dev` | watch-режим для разработки   |
| `npm run test`    | unit-tests (Jest)               |
| `npm run lint`    | ESLint                          |
| `npm run build`   | компиляция в `dist/`            |

## 🔭 Roadmap
- Auth + JWT, прогресс пользователя, UGC API.
- Интеграция с puzzle-core (solve/validate через gRPC/FFI).
- Подключение Postgres/Redis, Terraform/Helm манифесты.
- Observability (Prometheus, OpenTelemetry), Swagger/OpenAPI.

Вопросы/идеи — кидай в основной README или в чат, будем расширять дальше.
