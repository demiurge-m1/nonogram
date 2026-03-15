#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

section() {
  echo -e "\n[verify] $1\n------------------------------"
}

section "cargo fmt"
(
  cd "$ROOT_DIR/puzzle-core"
  cargo fmt --all --check
)

section "cargo clippy"
(
  cd "$ROOT_DIR/puzzle-core"
  cargo clippy --all-targets --all-features -- -D warnings
)

section "cargo test"
(
  cd "$ROOT_DIR/puzzle-core"
  cargo test --all-features
)

section "web lint"
(
  cd "$ROOT_DIR/web"
  npm run lint
)

section "web typecheck"
(
  cd "$ROOT_DIR/web"
  npm run typecheck
)
