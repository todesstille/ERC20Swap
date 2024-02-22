// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const ERC20Swapper = await hre.ethers.getContractFactory("ERC20Swapper");
  const swapper = await ERC20Swapper.deploy();
  await swapper.deployed();

  const tx = await swapper.__ERC20Swapper_init("0x1b81D678ffb9C0263b24A97847620C99d213eB14", 3000);
  await tx.wait();

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
