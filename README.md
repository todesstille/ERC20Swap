# ERC-20 swapping contract

Swapping contract for exchanging Ether (or native coin for different blockchains) to other ERC20 tokens.

Could rely on any Uniswap V2/V3-compatible router (e.g. PancakeSwap, QuickSwap, SushiSwap et cetera)

## Deployment

1. Install dependencies with `npm install` or `yarn install`
2. Copy `temp.env` to `.env` and fill it
3. Choose a uniswap-compatible router and fee. For uniswap-v2 fee MUST be set to 0

```shell
npm install
npx hardhat run ./scripts/deploy.js --network <network-of-choice>
npx hardhat verify --network <network-of-choice>
```

You could also deploy it as standalone, without proxy, if you want to make it more gas-efficient (but less flexible)