// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "./libraries/UniswapV2Library.sol";

import "./interfaces/IERC20EconomySwapper.sol";

contract ERC20EconomySwapper is IERC20EconomySwapper {

    using UniswapV2Library for *;

    address private weth;
    address private factory;

    constructor(address _factory, address _weth) {
        factory = _factory;
        weth = _weth;
    }

    function swapEtherToToken(address token, uint minAmount) external payable returns (uint) {
        uint256 amountIn = msg.value;
        require(amountIn > 0, "ERC20Swapper: ETH value must be non-zero");

        IWETH(weth).deposit{value: amountIn}();

        address pairAddress = factory.pairFor(token, weth);
        IWETH(weth).transfer(pairAddress, amountIn);

        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        
        (uint256 reserve0, uint256 reserve1) = factory.getReserves(weth, token);

        uint256 amountOut = amountIn.getAmountOut(reserve0, reserve1);

        uint256 balance = IERC20(token).balanceOf(msg.sender);

        weth < token 
            ? pair.swap(0, amountOut, msg.sender, "")
            : pair.swap(amountOut, 0, msg.sender, "");

        balance = IERC20(token).balanceOf(msg.sender) - balance;
        require(balance >= minAmount, "ERC20Swapper: insufficient swapped amount");

        return balance;
    }

}
