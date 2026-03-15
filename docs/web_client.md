# Web Client (PWA) Plan

## 1. Goals
- Построить Next.js/React PWA, повторяющую UX конкурентов (минималистичный светлый UI + тёмный режим), с офлайн-режимом и поддержкой UGC-редактора.
- Обеспечить интеграцию с backend API (packs, puzzles, progress, daily, UGC, монетизация).
- Поддержать рекламу (interstitial + rewarded), paywall/premium, anti-adblock UX.

## 2. Technology Stack
- **Framework**: Next.js 14 (App Router) + React + TypeScript.
- **Styling**: Tailwind CSS + дизайн-система компонентов (Radix/Chakra).  
- **State**: Zustand/Redux Toolkit для глобальных состояний (user, packs, progress, monetization).  
- **Canvas/Grid**: React + Konva или custom canvas with hooks для рисования сетки и обработки жестов.  
- **Data layer**: React Query / TanStack Query для API вызовов, IndexedDB (Dexie) для офлайн-кеша пазлов/UGC.  
- **PWA**: Next-PWA + Workbox (service worker, офлайн маршруты, пуш-уведомления через FCM).  
- **Ad SDK**: Google IMA/AdSense scripts, wrapper компоненты.  
- **UGC editor**: wasm-модуль (Rust) через `wasm-bindgen` + React UI.  
- **Testing**: Jest/RTL, Playwright e2e.

## 3. Major Screens & Flows
1. **Onboarding / Auth**: guest → optional login (email/Google/Apple) → выбор языка → sync progress.  
2. **Home**: featured packs, daily card, access to random puzzle, premium CTA.  
3. **Pack detail**: список пазлов с прогрессом, фильтры (size, difficulty).  
4. **Game screen**: canvas grid, toolbar (cross, fill, hints), status bar (time, mistakes, ads).  
5. **Daily/Events**: отдельные флоу с наградами, countdown.  
6. **Shop/Premium**: подписка, покупка паков, описание преимуществ.  
7. **UGC editor**: рисование/загрузка шаблона, отображение `solvable` статуса, публикация + sharing.  
8. **Community hub**: список пользовательских пазлов, фильтры по solvable, share links.  
9. **Settings**: звук, вибрация, тёмная тема, выбор языка (EN/DE/FR/ES/PT/IT/RU/JP/KO/ZH/TR ...), ad preferences.  
10. **Adblock notice**: overlay с предложением отключить ads или купить premium.

## 4. Offline Strategy
- Service Worker кеширует статику + API-ответы (packs list, daily).  
- IndexedDB хранит пазлы (bitmask + clues), прогресс, UGC черновики.  
- Пользователь может неограниченно играть уже скачанные пакеты офлайн; прогресс синхронизируется при восстановлении связи.  
- Daily/events доступны офлайн для прохождения, но награды и зачёт происходят после синхронизации.  
- Random puzzle и публикация UGC требуют онлайн.

## 5. Ads & Monetization UX
- Interstitial показывается после завершения пазла или каждые `N` минут (как задано backend).  
- Rewarded модалка: пользователь выбирает “получить подсказку за просмотр”.  
- Anti-adblock: проверяем загрузку IMA скриптов → при блокировке показываем toast/баннер + отключаем часть hint’ов до покупки премиума или отключения блокировщика.

## 6. Premium Experience
- Banner на главном экране, dedicated страница “Go Premium”.  
- После покупки: удаляем рекламу, увеличиваем награды, открываем пакеты.  
- Премиум-бейдж в профиле, эксклюзивные темы.

## 7. Integration Points
- API client (REST) с рефрешем JWT.  
- wasm-модуль (паззл логика) загружается по требованию, прогревается на странице игры и UGC редакторе.  
- FCM push: уведомления о daily, событиях, UGC откликах.  
- Firebase Remote Config / LaunchDarkly: feature flags для UI.

## 8. Development Roadmap (Web)
1. Настроить Next.js проект, архитектуру директорий, ESLint/Prettier.  
2. Реализовать auth flow + API client.  
3. Создать базовые экраны (Home, Pack, Game) + канвас-грid MVP.  
4. Добавить Daily/Event фичи, random puzzle.  
5. Встроить UGC редактор (wasm), community hub.  
6. Подключить монетизацию (ads, premium).  
7. Офлайн/PWA: service worker, IndexedDB, sync.  
8. Anti-adblock UX, paywall polish.  
9. Тесты (unit + Playwright), перф оптимизации, accessibility.  
10. Beta → prod релиз.

## 9. Outstanding items
- Утвердить UI-дизайн/бренд (цвета, иконки, иллюстрации).  
- Решить, какие языки на вебе поддерживаем на старт (по списку из продукта).  
- Определить точные правила офлайн-лимитов (сколько пазлов можно шить офлайн).  
- Уточнить UX для error-case (потеря соединения, неудачный просмотр рекламы).  
- Подготовить SDK-интеграцию для аналитики (Amplitude/ClickHouse events).

## 9. Error & Fallback UX
- Потеря сети: toast/banner "Вы офлайн, играйте из кеша" + кнопка "Продолжить офлайн"; автоматический retry при восстановлении соединения.
- Сбой рекламы: сообщение "Видео недоступно, попробуйте позже" без списания подсказок и с повторной попыткой.
- Неработающий API: graceful fallback (skeleton + retry), предложение обновить страницу или вернуться домой.
- Adblock активен: заметное уведомление с CTA "Отключите рекламу или оформите Premium".

## 10. Outstanding items
- Финализировать визуальный стиль (минимализм конкурентов + наши акценты) и ассеты тёмной темы.
- Настроить SDK событий (буфер офлайн → отправка в ClickHouse/Amplitude/Firebase).
- Определить требования по accessibility (контраст, клавиатурная навигация, screen reader labels).
- Оценить объём ассетов для офлайн-кеша и лимиты IndexedDB.
