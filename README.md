# Nonogram Project Notes

## 1. Vision / Reference Apps
- Target parity with Easybrain's **Nonogram.com** mobile apps (iOS/Android): https://easybrain.com/nonogram
- Mechanics similar to Easybrain Sudoku/Nonogram: daily puzzles, seasonal events, color & mono grids, hints, ads + premium model.
- Web parity with sudoku.com approach: React SPA with backend-driven content.

## 2. Core Feature Set
- **Gameplay**: black/white and color nonograms, multiple grid sizes, gesture support, drag fill, cross markers, error highlighting.
- **Content pipeline**: curated packs, daily challenge, seasonal live-ops, tournaments/leaderboards, collectible postcards.
- **Progression**: per-puzzle state, sync across devices, offline play with cached packs.
- **Hints & Assistance**: auto-fill line, single-cell hints, mistake freeze, multi-color palettes.
- **Monetization**: ad-supported free tier (interstitials/rewarded), subscription or unlock packs to remove ads/boost rewards.
- **LiveOps**: remote-configured events, feature flags, push campaigns, analytics-driven A/B.
- **Anti-cheat**: server validation of completions, suspicious-time detection, signed puzzle payloads.

## 3. Technical Stack (proposed)
### Clients
- **Web**: Next.js + React + TypeScript, Tailwind/Chakra for UI, Zustand/Redux for state, PWA for offline.
- **Mobile**: React Native (Expo) for shared UI/logic. Alternative: Flutter if нужен один код и кастомные жесты (но хуже SEO). Native wrappers possible позже.
- **Shared components**: Canvas-based grid (React/Konva on web, Skia/Reanimated on RN) with gesture handling.

### Puzzle Core
- Generator/solver on **Rust** (or Go) → compiled to **WebAssembly** for web + native libs for iOS/Android.
- Capabilities: image → grid conversion, clue calculation, uniqueness validation, hint strategies.
- Signed puzzle packages delivered from backend; client caches for offline play.

### Backend & Data
- **API**: NestJS (Node/TypeScript) or Go microservices; mix REST/GraphQL; WebSockets for tournaments.
- **Database**: PostgreSQL (users, purchases, packs, events, leaderboards); Redis for caching sessions/leaderboards; ClickHouse/BigQuery for analytics.
- **LiveOps services**: feature flags (LaunchDarkly/Unleash), Remote Config.
- **Storage**: S3/GCS for puzzle assets; CDN (CloudFront/Fastly) for delivery.

### Infrastructure
- Cloud: AWS or GCP (prefer AWS for broader services). Kubernetes (EKS/GKE) + Terraform IaC.
- Firebase components optionally for Auth, Crashlytics, Push, Remote Config (integrated via GCP or standalone).
- CI/CD: GitHub Actions → build clients, run Rust/TS tests, deploy to K8s, generate puzzle packs.

## 4. Offline & Security Considerations
- Core solver/generator embedded as binary (wasm/native) → harder to reverse.
- Critical logic (pack creation, scoring heuristics, anti-cheat, monetization triggers) stays server-side.
- Clients cache puzzle packs + state (IndexedDB/SQLite) for offline play; sync progress when online.
- Signed payloads and integrity checks to detect tampering.

## 5. Ads & Ad-block Mitigation (web)
- Detect blockers via bait elements/script loading checks.
- Graceful UX: request to disable adblock or offer premium. Limit certain conveniences until ads allowed.
- Serve rewarded ads via own subdomain/CDN to avoid filters; consider server-side ad insertion for partner deals.

## 6. Data Layer Rationale
- PostgreSQL chosen for: ACID transactions, relational consistency (users ↔ purchases ↔ packs ↔ events), reporting, migrations.
- Firestore useful дополнительно (realtime sync, offline cache, Firebase ecosystem) but не заменяет Postgres для платежей/турниров/аналитики. Комбинируем: Postgres как source of truth, Firestore для live-sync/Remote Config.

## 7. Competitor Notes / Links
- https://easybrain.com/nonogram (target app)
- https://nonogram.com/ (+ App Store / Google Play ссылки на мобильные приложения)
- Picture Cross (App Store: https://apps.apple.com/us/app/picture-cross/id977150768 / Google Play: https://play.google.com/store/apps/details?id=com.appynation.wbpc&gl=US)
- https://sudoku.com (reference web stack; React SPA + backend APIs)
- Веб-референсы: https://www.goobix.com/games/nonograms/ и https://www.puzzle-nonograms.com/ (5x5–15x15 уровни)

## 8. Next Steps
1. Finalize detailed feature backlog (MVP → parity).
2. Draft architecture doc (services, data schema, deployment).
3. Prototype puzzle core pipeline (image → clues) in Rust + wasm export.
4. Build UI proof-of-concept (canvas grid + gestures) in React/RN.
5. Set up cloud baseline (AWS/GCP, Postgres, Redis, CDN, Firebase for push/analytics).

## 9. Implementation Plan (detailed)
1. **Product scope & UX**  
   - Зафиксировать MVP/roadmap, включая набор режимов, подсказок, монетизацию.  
   - Подготовить веб-дизайн: сетка, панели подсказок, магазин, события, paywall.  
   - Описать игровые правила, тарифы на подсказки, экономику и рекламные сценарии.
2. **Puzzle core**  
   - Реализовать конвертер изображений → nonogram (Rust/Go) + wasm/native сборки.  
   - Покрыть уникальность решений, поддержку цветных пазлов и подсказочных эвристик.  
   - Настроить пайплайн генерации/модерации пакетов и подписей.
3. **Инфраструктура + Backend**  
   - Развернуть облако: Postgres, Redis, S3/GCS, CDN, Kubernetes/Cloud Run.  
   - Написать API (auth, выдача паков, прогресс, события, покупки), live-ops сервис.  
   - Настроить очереди задач для генерации новых пакетов, бэкапы, мониторинг.
4. **Web‑клиент (PWA)**  
   - Собрать Next.js/React фундамент, авторизацию, интеграцию с API.  
   - Реализовать canvas/gesture UI, подсказки, инвентарь, daily/seasonal экраны.  
   - Поставить PWA, IndexedDB кеш, синхронизацию прогресса, офлайн-режим.
5. **Монетизация и реклама**  
   - Интегрировать рекламные сети (IMA/AdSense) + adblock detection/UX.  
   - Настроить подписку/покупку наборов, rewarded hints, paywall “без рекламы”.  
   - Добавить аналитические и AB hooks для оптимизации дохода.
6. **Аналитика, LiveOps, античит**  
   - Подключить Firebase/GA/Amplitude, Remote Config, push-сценарии.  
   - Реализовать leaderboards/ивенты, античит (валидаторы, контроль времени).  
   - Настроить дашборды по retention/ARPU, систему feature flags.
7. **QA и веб-релиз**  
   - Юнит/интеграционные/Playwright e2e тесты, нагрузочное тестирование.  
   - Beta-тест (staging), оптимизация производительности/SEO/PWA.  
   - Production rollout + мониторинг, сбор фидбэка.
8. **Мобильные клиенты (финальный этап)**  
   - На базе React Native/Flutter подключить существующий core/API.  
   - Интегрировать нативные SDK (push, IAP, ads), повторить UX под тач-жесты.  
   - Тестирование, публикация в App Store/Google Play.
