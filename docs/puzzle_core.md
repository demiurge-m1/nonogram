# Puzzle Core Plan

## 1. Scope
- **Генерация паков**: ч/б nonograms 5×5–15×15 из подготовленных изображений, наборов тематик и случайных сидов.
- **Рандомный пазл**: on-demand генерация (с учётом сложности/размера) + кеширование результатов.
- **Solver/validator**: гарантирует единственность решения, поддерживает подсказки (auto-line, single cell, cross cleanup, mistake highlight).
- **UGC-редактор**: при сохранении пользовательского пазла валидируем уникальность/решаемость, присваиваем ID, помечаем `solvable=true/false`, сохраняем в storage, выдаём shareable URL и сразу публикуем (без ручной модерации).
- **Экспорт**: Rust/Go core → wasm (web) + native libs (iOS/Android) + CLI/worker (backend pipeline).

## 2. Архитектура
```
[Input Images / Patterns]   [UGC Editor]
           |                    |
      [Generator] <--------> [Validator/Solver]
           |                    |
      [Pack Builder]       [UGC Storage]
           |                    |
     [S3/CDN + Postgres metadata]
           |
   [Clients fetch signed packs]
```
- **Generator**: downscale/threshold image, build bitmask grid, compute row/column clues, enforce size limits.
- **Solver**: hybrid backtracking + logic heuristics; возвращает подсказки (какие клетки очевидны) и проверяет единственность.
- **Pack Builder**: группирует пазлы по темам, добавляет метаданные (icon, difficulty, unlock requirements) и подписывает перед загрузкой в S3.
- **UGC storage**: сохраняет JSON+bitmask пазла, метаданные автора, URL slug; moderation pipeline TBD.

## 3. Технологический стек
- Ядро: **Rust** (производительность + wasm support).  
- wasm target: `wasm32-unknown-unknown` + `wasm-bindgen` для web; JSI-бридж для React Native позже.  
- Backend workers: Rust binary (или Docker image) для пакетной генерации/валидиации.  
- Хранение: puzzles (bitmask) в S3/GCS, metadata в Postgres (packs, puzzles, user-generated).  
- API: NestJS/Go вызывает CLI/worker или Rust lib (через FFI) для генерации/валидации.

## 4. Данные и форматы
- **Bitmask**: храним как `Vec<u8>` (packed bits) + размер X/Y.  
- **Clues**: массивы чисел по строкам/столбцам.  
- **Metadata**: `id`, `pack_id`, `difficulty`, `size`, `theme`, `author_type (system/user)`, `created_at`, `signature`.  
- **UGC**: хранится как JSON + bitmask; URL формируем по slug (`/community/{slug}`).

## 5. Pipeline шаги
1. Инжест исходных изображений (внутренний редактор для художников).  
2. Rust generator создаёт кандидатов (5×5–15×15) → solver проверяет уникальность.  
3. Pack builder комплектует 20–50 пазлов, генерирует cover art, difficulty buckets.  
4. Результат подписывается и загружается в S3/CDN + metadata в Postgres.  
5. Для daily/random пазлов backend подбирает или генерирует по seed (с кешем).  
6. UGC Editor (на фронте) вызывает wasm-validator → при успехе отправляет данные на backend, где сохраняем и выдаём URL.

## 6. TODO / Открытые вопросы
- Детализировать алгоритм random-пазлов (использование пулов vs on-demand генерация, кеширование).  
- Формализовать формулу сложности (пороговые значения времени/шагов solver’а для Easy/Normal/Hard/Expert).  
- Добавить защиту от спама в UGC (rate-limit, жалобы).  
- Зафиксировать целевые объёмы генерации (пакеты/день) для оценки мощностей воркеров.  
- Описать формат API (взаимодействие фронта с wasm и backend сервисами).  
- Security детали (схема подписей, ключи, хранение проверок).
