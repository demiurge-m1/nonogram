# Analytics, LiveOps & Anti-Cheat Plan

## 1. Goals
- Собирать гейм-метрики (retention D1/D7/D30, DAU/MAU, ARPDAU/ARPPU, eCPM, session length, adblock share, hints usage) и бизнесовые KPI в реальном времени.
- Управлять контентом/ивентами/feature flags через LiveOps платформу (LaunchDarkly/Firebase Remote Config).
- Обеспечить античит и мониторинг честности (подсказки, время решения, UGC).

## 2. Event Tracking
- **Клиентские события** (buffer → backend → ClickHouse/Amplitude):
  - `session_start`, `session_end`, `puzzle_start`, `puzzle_complete`, `mistake`, `hint_used`, `ad_view`, `ad_skip`, `purchase_initiated`, `purchase_success`, `premium_state`, `ugc_create`, `ugc_play`, `daily_claim`, `event_progress`.
  - Каждое событие содержит: userId, sessionId, puzzleId, packId, size, difficulty, timestamp, offline flag.
- **Серверные события**: `pack_published`, `daily_generated`, `random_requested`, `stripe_webhook`, `adblock_detected`, `anti_cheat_flag`.
- Буферизация на клиенте: локальный queue в IndexedDB, отправка пакетами при сети.

## 3. Analytics Stack
- **Pipeline**: фронт/бэк → Kafka/SQS → ClickHouse (основной стор) + S3 raw logs.  
- **Dashboards**: Metabase/Superset для продуктовых метрик; Grafana/Looker для BI.  
- **Amplitude/Firebase Analytics**: зеркально отправляем ключевые события для маркетинга/UA.

## 4. LiveOps / Feature Flags
- **LaunchDarkly** для core-фич (включение событий, тестирование paywall).  
- **Firebase Remote Config** для лёгких UI-текстов/AB.  
- **События**: таблица расписания в Postgres, админ-панель для обновления контента (banners, rewards).  
- **A/B Testing**: трафик делится по userId, экспериментальные параметры (частота рекламы, стоимость подсказки, тексты paywall) задаются через flag.

## 5. Anti-Cheat & Integrity
- **Порог времени**: если пазл завершён быстрее, чем минимальное solver-время * X, помечаем подозрительным.  
- **Подсказки**: лимит использования в минуту, проверка сервером.  
- **UGC**: логируем IP, userId, solvable flag; автоматическая публикация, жалобы от игроков → ручная проверка.  
- **Progress tamper**: все сохранения подписаны server-side; клиент отправляет только delta, сервер проверяет допустимость.  
- **Ad fraud**: лимит на rewarded рекламные запросы, валидация от сети.

## 6. Admin & Tooling
- Web админ-панель (Next.js internal): управление паков, событий, баннеров, UGC-модерация, просмотр античит флагов.  
- Пуш-инструмент (через FCM) для отправки сообщений по сегментам (daily reminder, premium upsell).  
- On-call ротация: 24/7 duty-чат, целевая реакция ≤1 ч в рабочее время и ≤4 ч ночью/выходные.

## 7. Roadmap
1. Настроить event schema и client logger (buffered).  
2. Поднять ClickHouse cluster + ingestion pipeline.  
3. Интегрировать Amplitude/Firebase для маркетинга.  
4. Развернуть LaunchDarkly/Remote Config, связать с фронтом.  
5. Реализовать админ-панель (packs/events, флаги).  
6. Настроить античит правила/alerts.  
7. Создать BI dashboards (retention, monetization, ad metrics, UGC usage).  
8. Запустить регулярные LiveOps процессы (cron job генерации daily, сезонных ивентов).

## 8. Outstanding
- Зафиксировать целевые значения KPI (какие цифры считаем нормой для retention/ARPU и т.п.).  
- Назначить ответственных за обработку UGC-жалоб и формализовать процесс.  
- Подготовить расписание on-call (имена, контакты).  
- Выбрать инструменты для BI-дашбордов (Metabase vs Superset) и назначить владельцев.
