#!/bin/bash
# LittleInvestors — CertificateRegistry Contract Deployment Script
# Run this once to deploy the contract and get its CONTRACT_ID
# Prerequisites: stellar CLI installed (https://developers.stellar.org/docs/tools/cli/install-cli)

set -e

NETWORK="testnet"
CONTRACT_DIR="contracts/certificate"

echo "🚀 Building CertificateRegistry Soroban contract..."

# Build the WASM
cd "$CONTRACT_DIR"
cargo build --target wasm32-unknown-unknown --release

WASM_FILE="target/wasm32-unknown-unknown/release/certificate_registry.wasm"

echo "📦 WASM built at: $WASM_FILE"
echo ""

# Generate a deployer keypair if needed
if [ -z "$DEPLOYER_SECRET" ]; then
  echo "Generating a new deployer account..."
  stellar keys generate deployer --network "$NETWORK"
  stellar keys fund deployer --network "$NETWORK"
  DEPLOYER_SECRET=$(stellar keys show deployer --network "$NETWORK" --secret-key)
fi

echo "📡 Deploying to Stellar $NETWORK..."

# Deploy the contract
CONTRACT_ID=$(stellar contract deploy \
  --wasm "$WASM_FILE" \
  --network "$NETWORK" \
  --source-account "$DEPLOYER_SECRET" \
  --ignore-checks)

echo ""
echo "✅ Contract deployed!"
echo "   CONTRACT_ID=$CONTRACT_ID"
echo ""
echo "Add this to your .env file:"
echo "CONTRACT_ID=$CONTRACT_ID"
echo ""

# Initialize the contract with deployer as admin
echo "🔧 Initializing contract..."
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --network "$NETWORK" \
  --source-account "$DEPLOYER_SECRET" \
  -- initialize \
  --admin "$( stellar keys address deployer --network "$NETWORK" )"

echo "✅ Contract initialized! Admin is the deployer account."
echo ""
echo "Update your .env file with: CONTRACT_ID=$CONTRACT_ID"
