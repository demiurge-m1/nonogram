# Monetization & Ads Plan

## 1. Monetization Pillars
- **Free tier**: доступ ко всем базовым пакетам, daily, UGC; показываем interstitial + rewarded рекламу.
- **Premium subscription**: убирает рекламу, даёт x2 награды, открывает эксклюзивные пакеты/темы, приоритетный доступ к новым событиям. Тарифы: $4.99/мес и $29.99/год (автопродление).  
- **One-off purchases**: премиум паки ($1.99–$4.99 за 20–50 пазлов, “Super Pack” $9.99) и bundles Hint Tokens (20 за $1.99, 60 за $4.99).

## 2. Ads Strategy
- **Interstitial**: Google AdSense/IMA; показ после завершения пазла и каждые ~8 минут активной игры (если пазл длится дольше).  
- **Rewarded video**: за подсказку, продолжение после ошибки, мгновенный unlock пакета + опция “30 минут без рекламы” за просмотр.  
- **Banners**: только на неигровых экранах (Home/Shop) по необходимости.
- **Anti-adblock**: детекция через bait elements, уведомление + ограничение премиум-фич до отключения блокера или покупки подписки.

## 3. Premium Experience
- Экран “Go Premium” с преимуществами (без рекламы, x2 rewards, эксклюзивные пакеты/темы, ранний доступ).  
- Premium-бейдж в профиле, уникальные фоновые темы, доступ к цветным пазлам (когда появятся).  
- Предложения внутри приложения (upsell) после просмотра нескольких реклам или при исчерпании подсказок.

## 4. Economy & Hints
- Основная валюта: “Hint Tokens”. Бесплатный ежедневный бонус — 3 токена (максимум хранится 20).  
- Дополнительные способы: rewarded ads, достижения, bundles (20 за $1.99, 60 за $4.99).  
- Premium получает +1 дополнительный ежедневный токен и автоматическое пополнение до 5 при открытии приложения.

## 5. Payments / Billing
- **Web**: Stripe (card/Apple Pay/Google Pay). Подписки auto-renew.  
- **Later mobile**: интеграция с App Store/Google Play (через existing backend).  
- Backoffice: управление планами, промокоды, скидки.  
- Fraud detection: лимит на запросы, валидация квитанций, серверные webhook-и.

## 6. Analytics & AB-testing
- Трекинг ARPU/ARPDAU, eCPM, fill rate, ad fatigue.  
- A/B эксперименты (LaunchDarkly/Remote Config) для частоты рекламы, paywall текстов, пакетов.  
- Отдельные события: просмотр interstitial, отказ от рекламы, покупка premium, конверсия из adblock notice.

## 7. Roadmap
1. Интегрировать Stripe web-подписки (backend + фронт paywall).  
2. Подключить AdSense/IMA (interstitial + rewarded) и обвязку на фронте.  
3. Настроить выдачу hint tokens, дневные бонусы.  
4. Реализовать Premium UX (экраны, бейджи, эксклюзивные пакеты).  
5. Anti-adblock detection + UX.  
6. Analytics события и dashboard (ARPU/eCPM).  
7. Раскатать A/B фичи (частота рекламы, тексты paywall).

## 8. Outstanding
- Локализация цен и налогов по регионам (VAT, App Store pricing) — ближе к запуску.  
- Подготовка стартовых премиум паков/тем (конкретные темы, арт).  
- Решение по “Super Pack” наполнению.  
- Метрики успеха (целевые ARPU/eCPM) для мониторинга.
