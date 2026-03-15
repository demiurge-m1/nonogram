This folder stores the wasm-pack build output.

```
cd ../puzzle-core
wasm-pack build --target bundler --features wasm --out-dir ../web/src/wasm/pkg
```

`pkg/` хранится в репозитории, поэтому после обновления solver’а не забудь перегенерировать артефакты и закоммитить их.
