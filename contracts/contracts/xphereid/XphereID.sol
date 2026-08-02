// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {PublicResolver} from "../resolvers/PublicResolver.sol";
import {Namehash} from "./Namehash.sol";

/**
 * @title XphereID
 * @notice Read helpers: resolve `label.xp` → address and check ownership.
 * @dev Does not custody funds. Registry + resolver hold the source of truth.
 */
contract XphereID {
    ENS public immutable ens;
    /// @notice Namehash of `.xp`.
    bytes32 public immutable baseNode;

    constructor(ENS ensAddr) {
        require(address(ensAddr) != address(0), "XphereID: ens=0");
        ens = ensAddr;
        baseNode = Namehash.xpNode();
    }

    /// @notice Namehash of `label.xp`.
    function node(string calldata label) public pure returns (bytes32) {
        return Namehash.labelNode(label);
    }

    /// @notice Registry owner of `label.xp` (address(0) if unset).
    function owner(string calldata label) external view returns (address) {
        return ens.owner(Namehash.labelNode(label));
    }

    /**
     * @notice Resolve `label.xp` to an address via the node's resolver `addr` record.
     * @return Resolved address, or address(0) if missing resolver / empty record.
     */
    function resolve(string calldata label) external view returns (address) {
        bytes32 n = Namehash.labelNode(label);
        address resolverAddr = ens.resolver(n);
        if (resolverAddr == address(0)) {
            return address(0);
        }
        return PublicResolver(resolverAddr).addr(n);
    }
}
