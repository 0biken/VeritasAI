#!/bin/bash
set -e

# Configuration
CONTRACT_NAME="${1:-veritasai.testnet}"
OWNER_ACCOUNT="${2:-$CONTRACT_NAME}"
PLATFORM_FEE_BPS="${3:-250}"  # 2.5% default fee

echo "Deploying VeritasAI to: $CONTRACT_NAME"

# Build first
./build.sh

# Deploy contract
near deploy "$CONTRACT_NAME" ./out/veritasai_contract.wasm

# Initialize contract
echo "Initializing contract..."
near call "$CONTRACT_NAME" new "{\"owner\": \"$OWNER_ACCOUNT\", \"platform_fee_bps\": $PLATFORM_FEE_BPS}" --accountId "$CONTRACT_NAME"

echo ""
echo "✅ Deployment complete!"
echo "Contract: $CONTRACT_NAME"
echo "Owner: $OWNER_ACCOUNT"
echo "Platform Fee: $(echo "scale=2; $PLATFORM_FEE_BPS / 100" | bc)%"
