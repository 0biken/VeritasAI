# VeritasAI Smart Contract

NEAR Protocol smart contract for the VeritasAI decentralized AI training data marketplace.

## Features

- **Dataset Listings** - List datasets with metadata, CID, validation info, and pricing
- **Purchases** - Buy access to datasets with automatic royalty distribution
- **Validation Tracking** - Store Bio.xyz validation scores and ZK proof hashes
- **Platform Fees** - Configurable fee structure (default 2.5%)

## Build

```bash
# Install Rust and WASM target
rustup target add wasm32-unknown-unknown

# Build contract
./build.sh
```

## Deploy

```bash
# Deploy to testnet
./deploy.sh veritasai.testnet

# With custom owner and fee
./deploy.sh veritasai.testnet owner.testnet 300
```

## Contract Methods

### Write Methods

| Method | Description |
|--------|-------------|
| `list_dataset` | List a new dataset on marketplace |
| `purchase_dataset` | Purchase access to a dataset |
| `update_price` | Update listing price (owner only) |
| `deactivate_dataset` | Remove listing (owner/admin) |

### View Methods

| Method | Description |
|--------|-------------|
| `get_dataset` | Get single dataset by ID |
| `get_datasets` | Get paginated dataset list |
| `get_datasets_by_owner` | Get all datasets by owner |
| `verify_purchase` | Check if account purchased dataset |

## Testing

```bash
cargo test
```
