const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Swapper", function () {

  before(async () => {
    [admin, alice, bob, charlie] = await ethers.getSigners();
    ERC20Swapper = await ethers.getContractFactory("ERC20Swapper");
  });

  describe("Basic functionality", function () {

    beforeEach(async () => {
      swapper = await ERC20Swapper.deploy();
      await swapper.__ERC20Swapper_init();
    });
  
    it("deploy parameters", async () => {
    });

    it("cant initialize twice", async () => {
      await expect(swapper.__ERC20Swapper_init()).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("must revert", async () => {
      // await expect(swapper.connect(alice).changeOwners([bob.address], true))
      //   .to.be.revertedWith("Ownable: caller is not the owner");
      // await expect(swapper.connect(alice).changeMinters([bob.address], true))
      //   .to.be.revertedWith("Ownable: caller is not the owner");
      // await expect(swapper.connect(alice).mint(bob.address, 1))
      //   .to.be.revertedWith("Caller is not a minter");
      // await expect(swapper.connect(alice).burn(bob.address, 1))
      //   .to.be.revertedWith("Caller is not a minter");
    });

  });

  describe("Upgradeability", function () {
    beforeEach(async () => {
      logic = await ERC20Swapper.deploy();
      const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
      erc1967 = await ERC1967Proxy.deploy(logic.address, "0x");
      swapper = await ethers.getContractAt("ERC20Swapper", erc1967.address);
      await swapper.__ERC20Swapper_init();
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