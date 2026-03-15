# Initial Backlog & Roadmap

## 0. Foundations
- [ ] Создать репозитории (frontend, backend, puzzle-core, infra).  
- [ ] Настроить общие инструменты: Jira/Linear, Slack/Discord каналы, документацию.  
- [ ] Kickoff дизайн-команды (гайд, палитра, UI-компоненты).

## 1. Product & Design
- [ ] Финализировать UX-потоки и макеты (Home, Pack, Game, Daily, Shop, UGC, Settings).  
- [ ] Подготовить дизайн-систему (компоненты, тёмная тема, иконки).  
- [ ] Создать ассеты для паков/ивентов/премиум тем.

## 2. Puzzle Core
- [ ] Реализовать Rust ядро (generator + solver + wasm экспорт).  
- [ ] Построить pipeline генерации паков (CLI/worker, S3 upload, Postgres metadata).  
- [ ] UGC-валидатор + shareable URL сервис.  
- [ ] Тесты (unit, property tests) и benchmarking.  
- [ ] Подписывание контента и контроль версий паков.

## 3. Infrastructure & Backend
- [ ] Развернуть AWS инфраструктуру (Terraform: VPC, EKS, Aurora, Redis, S3, CloudFront, SQS).  
- [ ] Gateway API (auth, packs, puzzles, progress, random, daily, UGC, purchases).  
- [ ] Puzzle worker service (SQS consumers).  
- [ ] Admin backend (packs/events management, UGC moderation).  
- [ ] Stripe интеграция (webhooks, subscription logic).  
- [ ] Monitoring/alerting (Prometheus, Grafana, Loki, Sentry).  
- [ ] Logging & security (WAF, IAM, secrets).

## 4. Web Client (PWA)
- [ ] Настроить Next.js проект, базовый layout, i18n.  
- [ ] Реализовать Home/Pack/Game экраны + канвас-сетку.  
- [ ] Daily/Event flow и random puzzle.  
- [ ] Shop & Premium UX, paywall.  
- [ ] UGC editor + community hub (включая wasm-модуль).  
- [ ] Ads integration (interstitial/rewarded) + anti-adblock.  
- [ ] PWA/offline (service worker, IndexedDB sync).  
- [ ] Error/fallback UX, accessibility.  
- [ ] Unit/e2e tests, перф оптимизации.

## 5. Monetization & Economy
- [ ] Настроить Hint Tokens систему (daily bonus, bundles, inventory).  
- [ ] Подключить rewarded “30 мин без рекламы”.  
- [ ] Настроить premium perks (x2 rewards, эксклюзивные пакеты, темы).  
- [ ] Заполнить премиум пакеты (контент + цены).  
- [ ] Ad frequency controls (backend + конфиги).

## 6. Analytics, LiveOps & Anti-Cheat
- [ ] Развернуть ClickHouse + ingestion pipeline.  
- [ ] Импорт событий в Amplitude/Firebase.  
- [ ] Реализовать client event SDK (buffer/offline).  
- [ ] Настроить LaunchDarkly + Remote Config интеграции.  
- [ ] Создать админ-панель для LiveOps/бэннеров.  
- [ ] Реализовать античит правила, жалобы на UGC, alerts.  
- [ ] Построить дашборды (Metabase/Superset) + on-call процессы.

## 7. QA & Release
- [ ] Smoke/регрессионные тесты, Playwright сценарии.  
- [ ] Load testing (API, websocket TBD).  
- [ ] Beta-тест (closed), сбор фидбэка.  
- [ ] Production rollout план (phased), мониторинг.  
- [ ] Релизная коммуникация (страница, маркетинговые материалы).

## 8. Post-launch / Mobile Prep
- [ ] Планирование мобильных клиентов (React Native/Flutter) на основе веб-ядра.  
- [ ] Подготовка Adjust/Appsflyer integration (на будущее).  
- [ ] Roadmap для цветных пазлов и расширенных сеток.

> Приоритизация: шаги 0–4 стартуют параллельно (core/backend/web/design). Монетизация/аналитика подключаются, когда скелет готов. QA/релиз — ближе к бете. Post-launch задачи — после стабилизации веб версии.

## Sprint 0 (Foundations)
**Дизайн**
- [ ] Собрать moodboard/референсы, утвердить палитру и UI-гайд.  
- [ ] Прототипировать ключевые экраны (Home, Game, Shop, UGC) в Figma.  
- [ ] Подготовить компонентную библиотеку (кнопки, карточки, панели).

**Инфраструктура/репо**
- [ ] Создать GitHub организации/репозитории (frontend, backend, puzzle-core, infra).  
- [ ] Настроить базовый CI (lint/test) для каждого репо.  
- [ ] Подготовить Terraform скелет (VPC, S3, IAM) и Helm чарты-шаблоны.  
- [ ] Настроить дев-окружение (Docker Compose или kind) для локальной разработки.

**Puzzle Core**
- [ ] Развернуть Rust проект, реализовать черновой solver (ч/б 5×5–15×15).  
- [ ] Собрать wasm прототип и интеграцию с тестовым UI.  
- [ ] Описать API между core и backend (CLI/gRPC).

**Backend API**
- [ ] Создать NestJS/Go skeleton (auth, health, version).  
- [ ] Настроить подключение к Postgres (локально), миграции.  
- [ ] Реализовать минимальные эндпоинты (`/packs` mock, `/auth/login` stub).

**Организация работы**
- [ ] Настроить доску задач (Jira/Linear) по эпикам.  
- [ ] Определить ритуалы (еженедельные синки, демо).  
- [ ] Подготовить Confluence/Notion для документации (ссылки на уже созданные файлы).
