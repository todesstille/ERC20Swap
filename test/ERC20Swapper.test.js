const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();

const uniswapV2Router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const uniswapV3Router = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const eth1 = ethers.utils.parseEther("1");
const expectedUsdtV2 = ethers.BigNumber.from("2917153871");
const expectedUsdtV3 = ethers.BigNumber.from("2919653252");

describe("ERC20 Swapper", function () {

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
    
    ERC20Swapper = await ethers.getContractFactory("ERC20Swapper");
    
    usdt = await ethers.getContractAt("IERC20", "0xdAC17F958D2ee523a2206206994597C13D831ec7");
  });

  describe("Basic functionality", function () {

    beforeEach(async () => {
      swapper = await ERC20Swapper.deploy();
      await swapper.__ERC20Swapper_init(
        uniswapV2Router, 
        0
      );
    });
  
    it("deploy parameters", async () => {
      let swapData = await swapper.swapData();
      expect(swapData.router).to.equal(uniswapV2Router);
      expect(swapData.swapFee).to.equal(0);
    });

    it("cant initialize twice", async () => {
      await expect(swapper.__ERC20Swapper_init(
        uniswapV2Router, 
        0
      )).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("must revert", async () => {
      await expect(swapper.connect(alice).transferOwnership(bob.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
      await expect(swapper.connect(alice).changeSwapData(uniswapV2Router, 1))
        .to.be.revertedWith("Ownable: caller is not the owner");
      await expect(swapper.changeSwapData(ethers.constants.AddressZero, 0))
        .to.be.revertedWith("ERC20Swapper: Router must not be zero address");
      await expect(swapper.swapEtherToToken(usdt.address, 0))
        .to.be.revertedWith("ERC20Swapper: ETH value must be non-zero");
    });

  });

  describe("Uniswap V2 swap", function () {

    it("Could swap", async () => {
      const balanceBefore = await usdt.balanceOf(alice.address);
      await swapper.connect(alice).swapEtherToToken(usdt.address, 0, {value: eth1});
      expect((await usdt.balanceOf(alice.address)).sub(balanceBefore))
        .to.equal(expectedUsdtV2);
    });

    it("Cant swap lesser then min", async () => {
      await expect(
        swapper.connect(alice).swapEtherToToken(usdt.address, expectedUsdtV2.add(1), {value: eth1})
      ).to.be.revertedWith('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
      
    });
  });

  describe("Uniswap V3 swap", function () {
    beforeEach(async () => {
      await swapper.changeSwapData(uniswapV3Router, 500);
    });

    it("pool parameters", async () => {
      let swapData = await swapper.swapData();
      expect(swapData.router).to.equal(uniswapV3Router);
      expect(swapData.swapFee).to.equal(500);
    });

    it("Could swap", async () => {
      const balanceBefore = await usdt.balanceOf(alice.address);
      await swapper.connect(alice).swapEtherToToken(usdt.address, expectedUsdtV3, {value: eth1});
      expect((await usdt.balanceOf(alice.address)).sub(balanceBefore))
        .to.equal(expectedUsdtV3);
    });

    it("Cant swap lesser then min", async () => {
      await expect(
        swapper.connect(alice).swapEtherToToken(usdt.address, expectedUsdtV3.add(1), {value: eth1})
      ).to.be.revertedWith('Too little received');
      
    });
  });

  describe("Upgradeability", function () {
    beforeEach(async () => {
      logic = await ERC20Swapper.deploy();
      const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
      erc1967 = await ERC1967Proxy.deploy(logic.address, "0x");
      swapper = await ethers.getContractAt("ERC20Swapper", erc1967.address);
      await swapper.__ERC20Swapper_init(
        uniswapV2Router, 
        0
      );
    });

    it("Correct implementation", async () => {
      expect(await swapper.getImplementation()).to.equal(logic.address);
    });

    it("Cant upgrade by not owner", async () => {
      logic1 = await ERC20Swapper.deploy();
      await expect(swapper.connect(alice).upgradeTo(logic1.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Could upgrade", async () => {
      logic1 = await ERC20Swapper.deploy();
      await swapper.upgradeTo(logic1.address);
      expect(await swapper.getImplementation()).to.equal(logic1.address);
    });
  });
});