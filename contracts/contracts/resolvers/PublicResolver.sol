// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

/**
 * @title PublicResolver
 * @notice Minimal ENS-style public resolver (`addr` only) for XphereID.
 * @dev No text/DNS/multicoin/NameWrapper. Node owner sets the address record.
 */
contract PublicResolver {
    ENS public immutable ens;

    mapping(bytes32 => address) private addresses;

    event AddrChanged(bytes32 indexed node, address a);

    modifier onlyOwner(bytes32 node) {
        require(ens.owner(node) == msg.sender, "PublicResolver: not owner");
        _;
    }

    /// @param ensAddr Shared ENS registry.
    constructor(ENS ensAddr) {
        require(address(ensAddr) != address(0), "PublicResolver: ens=0");
        ens = ensAddr;
    }

    /// @notice Bind `node` to address `a` (caller must own `node` in the registry).
    function setAddr(bytes32 node, address a) external onlyOwner(node) {
        addresses[node] = a;
        emit AddrChanged(node, a);
    }

    /// @notice Read the address record for `node`.
    function addr(bytes32 node) external view returns (address) {
        return addresses[node];
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return
            interfaceID == 0x3b3b57de || // IAddrResolver
            interfaceID == 0x01ffc9a7; // ERC165
    }
}
