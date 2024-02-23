const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();

const uniswapV2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const eth1 = ethers.utils.parseEther("1");

const expectedUsdtV2 = ethers.BigNumber.from("2917153871");
const expectedUsdcV2 = ethers.BigNumber.from("2917755558");

describe("ERC20 Economy Swapper", function () {

  before(async () => {

    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.ETH_URL,
            blockNumber: 19280000,
          },
        },
      ],
    });

    [admin, alice, bob, charlie] = await ethers.getSigners();
    
    ERC20EconomySwapper = await ethers.getContractFactory("ERC20EconomySwapper");
    
    usdt = await ethers.getContractAt("IERC20", "0xdAC17F958D2ee523a2206206994597C13D831ec7");
    usdc = await ethers.getContractAt("IERC20", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
  });

  beforeEach(async () => {
    swapper = await ERC20EconomySwapper.deploy(uniswapV2Factory, weth);
  });

  describe("Basic functionality", function () {

    it("must revert", async () => {
      await expect(swapper.swapEtherToToken(usdt.address, 0))
        .to.be.revertedWith("ERC20Swapper: ETH value must be non-zero");
    });

  });

  describe("Uniswap V2 swap", function () {

    it("Could swap usdt", async () => {
      const balanceBefore = await usdt.balanceOf(alice.address);
      await swapper.connect(alice).swapEtherToToken(usdt.address, expectedUsdtV2, {value: eth1});
      expect((await usdt.balanceOf(alice.address)).sub(balanceBefore))
        .to.equal(expectedUsdtV2);
    });

    it("Cant swap lesser then min", async () => {
      await expect(
        swapper.connect(alice).swapEtherToToken(usdt.address, expectedUsdtV2.add(1), {value: eth1})
      ).to.be.revertedWith('ERC20Swapper: insufficient swapped amount');      
    });

    it("Could swap usdc", async () => {
      const balanceBefore = await usdc.balanceOf(alice.address);
      await swapper.connect(alice).swapEtherToToken(usdc.address, expectedUsdcV2, {value: eth1});
      expect((await usdc.balanceOf(alice.address)).sub(balanceBefore))
        .to.equal(expectedUsdcV2);
    });

  });
});