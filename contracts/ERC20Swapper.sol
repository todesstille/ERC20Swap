// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./IERC20Swapper.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ERC20Swapper is IERC20Swapper, Initializable, UUPSUpgradeable, OwnableUpgradeable {

    function __ERC20Swapper_init() external initializer {
        __UUPSUpgradeable_init();
        __Ownable_init();
    }

    function swapEtherToToken(address token, uint minAmount) external payable override returns (uint) {

    }

    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
