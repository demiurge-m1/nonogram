# Puzzle Core

Rust crate with the nonogram data model + solver shared across clients.

## Usage

```bash
cd puzzle-core
cargo test
cargo run --bin solve samples/smiley.json
```

`samples/smiley.json` содержит простой 5×5 пазл. CLI печатает сетку (`#` = закрашено, `.` = пусто).

## WebAssembly build

```bash
wasm-pack build --target bundler --features wasm
```

Это собирает `pkg/` с wasm + JS glue. Для Next.js/PWA можно импортировать helper из `bindings/solve.ts`:

```ts
import { solvePuzzle } from '@nonogram/puzzle-core/bindings/solve';
const result = await solvePuzzle(puzzleJson);
```

## Benchmarks

```bash
cargo bench --bench solver
```

Criterion собирает метрику `solve_smiley`, чтобы отслеживать регрессии скорости.

## Next Steps
- Property-based tests (proptest) + fuzz.
- Расширенные wasm API (подсказки, проверка шагов).
- Публикация crate/npm пакета.
