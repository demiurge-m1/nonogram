# Nonogram Web Client

Next.js 14 (App Router) frontend for the nonogram prototype.

## Prerequisites

- Node 20+
- Rust toolchain (`rustup`) + `wasm-pack` (used to build the solver)

## Local dev

```bash
# 1. Build the wasm solver once (rerun after puzzle-core changes)
cd ../puzzle-core
wasm-pack build --target bundler --features wasm

# 2. Start the web app
cd ../web
npm install
npm run dev
```

The dev server runs on http://localhost:3000 (Turbopack). Network URL also printed in the console.

## Wasm helper

`src/lib/wasmSolver.ts` lazily imports the compiled package from `../puzzle-core/pkg` and exposes a typed `solveWithWasm(puzzle)` helper. `PuzzleClient` now relies on it for win detection instead of сравнения с моками.

## Linting & Types

```bash
npm run lint
npm run typecheck
```

`lint` = ESLint, `typecheck` = `tsc --noEmit` (используется и в CI).
