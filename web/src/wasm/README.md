This folder stores the wasm-pack build output.

```
cd ../puzzle-core
wasm-pack build --target bundler --features wasm --out-dir ../web/src/wasm/pkg
```

`pkg/` stays untracked; Next.js imports from `@/wasm/pkg`.
