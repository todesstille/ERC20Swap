// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

interface IERC20Swapper {
    
    struct SwapData {
        address router;
        uint24 swapFee;
    }

    /// @dev swaps the `msg.value` Ether to at least `minAmount` of tokens in `address`, or reverts
    /// @param token The address of ERC-20 token to swap
    /// @param minAmount The minimum amount of tokens transferred to msg.sender
    /// @return The actual amount of transferred tokens
    function swapEtherToToken(address token, uint minAmount) external payable returns (uint);
}