# ERC-20 swapping contract

Swapping contract for exchanging Ether (or native coin for different blockchains) to other ERC20 tokens.

Could rely on any Uniswap V2/V3-compatible router (e.g. PancakeSwap, QuickSwap, SushiSwap et cetera)

This repo relies on ETH forking in tests, so please set your mainnet provider in .env

## Deployment

1. Install dependencies with `npm install` or `yarn install`
2. Copy `temp.env` to `.env` and fill it
3. Choose a uniswap-compatible router and fee. For uniswap-v2 fee MUST be set to 0

```shell
npm install
npx hardhat run ./scripts/deploy.js --network <network-of-choice>
npx hardhat verify <logic-address> --network <network-of-choice>
npx hardhat verify <proxy-address> <logic-address> <"0x"> --network <network-of-choice>
```

You could also deploy it as standalone, without proxy, if you want to make it more gas-efficient (but less flexible)

This implementation rates flexibility over gas-economy. Gas costs could be redused by bypassing the router and interacting directly with the DEX pools, but it will make it less flexible.

Also this contract at any moment could be made completely trustless by renouncing ownership, but this will make it stick to exactly one router.

# ERC-20 economic swapping contract

This contract doesnt use router and interacts directly with a uniswap pair. Also it is not upgradeable. It have made to remove excessive call to router and delegatecall to contract implementation.

It could be deployed to any network that has DEX with uniswap v2-like factory, but you should manually set inside `UniswapV2Library.sol` the hash of pair creation bytecode (it could be different depending on compilation parameters). Also it should be deployed with Factory and WETH addresses passed to constructor

```shell
npm install
npx hardhat run ./scripts/deployEconomy.js --network <network-of-choice>
npx hardhat verify <contract-address> <factory-address> <weth-address> --network <network-of-choice>
```