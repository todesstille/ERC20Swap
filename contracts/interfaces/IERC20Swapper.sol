// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

interface IERC20Swapper {
    
    /// @notice The struct holds data about current swap router
    /// @param router The router address. Must be uniswap v2/v3 compatible
    /// @param swapFee The 0 for uniswap v2 router, exact swap pool fee for uniswap v3
    struct SwapData {
        address router;
        uint24 swapFee;
    }

    /// @dev swaps the `msg.value` Ether to at least `minAmount` of tokens in `address`, or reverts
    /// @param token The address of ERC-20 token to swap
    /// @param minAmount The minimum amount of tokens transferred to msg.sender
    /// @return The actual amount of transferred tokens
    function swapEtherToToken(address token, uint minAmount) external payable returns (uint);

    /// @dev allows swap owner to change router and/or pool fee
    /// @param router The router address. Must be uniswap v2/v3 compatible
    /// @param swapFee The 0 for uniswap v2 router, exact swap pool fee for uniswap v3
    function changeSwapData(address router, uint24 swapFee) external;
}