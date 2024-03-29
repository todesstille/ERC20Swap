// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require('dotenv').config();

async function main() {

  const ERC20EconomySwapper = await hre.ethers.getContractFactory("ERC20EconomySwapper");
  const swapper = await ERC20EconomySwapper.deploy(
    process.env.FACTORY,
    process.env.WETH,
  );
  await swapper.deployed();

  console.log(
    `Swapper deployed to ${swapper.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Swapper deployed to 0x9e75188302E7d28762b9893312C0dcB978F05773
