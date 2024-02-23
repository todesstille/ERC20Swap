// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require('dotenv').config();

async function main() {

  const ERC20Swapper = await hre.ethers.getContractFactory("ERC20Swapper");
  const logic = await ERC20Swapper.deploy();
  await logic.deployed();

  const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
  const proxy = await ERC1967Proxy.deploy(logic.address, "0x")
  await proxy.deployed();

  const swapper = await ethers.getContractAt("ERC20Swapper", proxy.address);

  const tx = await swapper.__ERC20Swapper_init(
    process.env.ROUTER, 
    process.env.SWAP_FEE
  );
  await tx.wait();

  console.log(
    `Swapper deployed to ${proxy.address}`
  );
  console.log(
    `with the implementation at ${logic.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Swapper deployed to 0x1C6FD966E1E06Ba4B69e0e3d5Fc0D44aaf48e188
// with the implementation at 0x3aC9C88E9096b6e1426FfA3FFD9B39c46938DDBb
