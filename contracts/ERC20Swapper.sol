// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IPeripheryImmutableState.sol";

import "./IERC20Swapper.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ERC20Swapper is IERC20Swapper, Initializable, UUPSUpgradeable, OwnableUpgradeable {

    SwapData public swapData;

    function __ERC20Swapper_init() external initializer {
        __UUPSUpgradeable_init();
        __Ownable_init();
    }

    function swapEtherToToken(address token, uint minAmount) external payable override returns (uint) {

    }

    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function _swapEtherV2(address tokenOut, uint amountIn, uint minAmountOut) internal {
        IUniswapV2Router02 router = IUniswapV2Router02(swapData.router);

        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = tokenOut;
        
        router.swapExactETHForTokens{value: amountIn}(minAmountOut, path, msg.sender, 0);
    }

    function _swapEtherV3(address tokenOut, uint amountIn, uint minAmountOut) internal {
        ISwapRouter router = ISwapRouter(swapData.router);
        address weth9 = IPeripheryImmutableState(swapData.router).WETH9();

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: weth9,
            tokenOut: tokenOut,
            fee: swapData.routerFee,
            recipient: msg.sender,
            deadline: 0,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0
        });

        router.exactInputSingle{value: amountIn}(params);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
