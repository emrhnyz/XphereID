// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Namehash
 * @notice ENS-compatible namehash helpers for the `.xp` TLD.
 */
library Namehash {
    /// @notice Namehash of the bare TLD label `xp` under the root (i.e. `.xp`).
    function xpNode() internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(bytes32(0), keccak256(bytes("xp")))
            );
    }

    /// @notice Namehash of `label.xp`.
    function labelNode(string memory label) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(xpNode(), keccak256(bytes(label)))
            );
    }

    /// @notice Keccak of the label string (ENS labelhash).
    function labelhash(string memory label) internal pure returns (bytes32) {
        return keccak256(bytes(label));
    }
}
