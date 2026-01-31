#!/bin/bash
set -e
cd "$(dirname $0)"
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p res
cp target/wasm32-unknown-unknown/release/veritasai_contract.wasm ./res/
echo "Build complete: ./res/veritasai_contract.wasm"
echo "Size: $(ls -lh ./res/veritasai_contract.wasm | awk '{print $5}')"
