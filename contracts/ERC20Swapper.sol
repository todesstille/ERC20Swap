// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IPeripheryImmutableState.sol";

import "./IERC20Swapper.sol";
import "./IWETH9.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract ERC20Swapper is IERC20Swapper, Initializable, UUPSUpgradeable, OwnableUpgradeable {

    SwapData public swapData;

    function __ERC20Swapper_init(address router, uint24 swapFee) external initializer {
        __UUPSUpgradeable_init();
        __Ownable_init();
        _setSwapData(router, swapFee);
    }

    function changeSwapData(address router, uint24 swapFee) external onlyOwner {
        _setSwapData(router, swapFee);
    }

    function swapEtherToToken(address token, uint minAmount) external payable override returns (uint) {
        uint amountIn = msg.value;
        require(amountIn != 0, "ERC20Swapper: ETH value must be non-zero");

        uint256 balanceBefore = IERC20(token).balanceOf(msg.sender);

        swapData.swapFee == 0
            ? _swapEtherV2(token, amountIn, minAmount)
            : _swapEtherV3(token, amountIn, minAmount);

        uint256 amountOut = IERC20(token).balanceOf(msg.sender) - balanceBefore;
        
        // This situation should not occure, and this line doesnt spoil the coverage
        assert(amountOut >= minAmount);

        return amountOut;
    }

    function _swapEtherV2(address tokenOut, uint amountIn, uint minAmountOut) internal {
        IUniswapV2Router02 router = IUniswapV2Router02(swapData.router);

        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = tokenOut;
        
        router.swapExactETHForTokens{value: amountIn}(minAmountOut, path, msg.sender, block.timestamp);
    }

    function _swapEtherV3(address tokenOut, uint amountIn, uint minAmountOut) internal {
        ISwapRouter router = ISwapRouter(swapData.router);
        address weth9 = IPeripheryImmutableState(swapData.router).WETH9();

        IWETH9(weth9).deposit{value: amountIn}();
        IWETH9(weth9).approve(swapData.router, amountIn);

        console.log(IWETH9(weth9).balanceOf(address(this)));
        console.log(amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: weth9,
            tokenOut: tokenOut,
            fee: swapData.swapFee,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0
        });

        router.exactInputSingle(params);
    }

    function _setSwapData(address router, uint24 swapFee) internal {
        require(router != address(0), "ERC20Swapper: Router must not be zero address");
        swapData = SwapData({
            router: router,
            swapFee: swapFee
        });
    }

    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
