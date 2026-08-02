// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {Namehash} from "./Namehash.sol";

/**
 * @title XpRegistrar
 * @notice First-come paid registrar for second-level `.xp` names (XphereID MVP).
 * @dev Must be set as owner of the `.xp` node in {ENSRegistry} before registrations work.
 *      No auctions, no marketplace, no subdomains-for-sale in v1.
 */
contract XpRegistrar {
    ENS public immutable ens;
    /// @notice Namehash of `.xp`.
    bytes32 public immutable baseNode;

    address public owner;
    address public treasury;
    /// @notice Registration price in native token wei (XP / XPT).
    uint256 public price;
    /// @notice Default resolver written into the registry on register.
    address public defaultResolver;

    /// @dev labelhash => registered label (for discovery / My Names indexing).
    mapping(bytes32 => string) public labels;

    event NameRegistered(
        string name,
        bytes32 indexed labelhash,
        address indexed owner,
        uint256 fee
    );
    event PriceChanged(uint256 oldPrice, uint256 newPrice);
    event TreasuryChanged(address indexed oldTreasury, address indexed newTreasury);
    event DefaultResolverChanged(address indexed resolver);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "XpRegistrar: not owner");
        _;
    }

    /**
     * @param ensAddr ENS registry.
     * @param treasury_ Fee recipient (must be non-zero).
     * @param price_ Initial fee in wei — keep low for grant demo.
     * @param defaultResolver_ PublicResolver (or compatible) address.
     */
    constructor(
        ENS ensAddr,
        address treasury_,
        uint256 price_,
        address defaultResolver_
    ) {
        require(address(ensAddr) != address(0), "XpRegistrar: ens=0");
        require(treasury_ != address(0), "XpRegistrar: treasury=0");
        require(defaultResolver_ != address(0), "XpRegistrar: resolver=0");

        ens = ensAddr;
        baseNode = Namehash.xpNode();
        owner = msg.sender;
        treasury = treasury_;
        price = price_;
        defaultResolver = defaultResolver_;
    }

    /// @notice Whether `label.xp` is free (no owner in the registry).
    function available(string calldata label) public view returns (bool) {
        require(_validLabel(label), "XpRegistrar: invalid label");
        return ens.owner(Namehash.labelNode(label)) == address(0);
    }

    /**
     * @notice Register `label.xp` for `msg.sender` by paying at least {price}.
     * @dev Sets registry owner + default resolver. Caller should then `setAddr` on the resolver.
     */
    function register(string calldata label) external payable {
        require(_validLabel(label), "XpRegistrar: invalid label");
        require(available(label), "XpRegistrar: taken");
        require(msg.value >= price, "XpRegistrar: insufficient fee");

        bytes32 labelHash = Namehash.labelhash(label);
        labels[labelHash] = label;

        ens.setSubnodeRecord(
            baseNode,
            labelHash,
            msg.sender,
            defaultResolver,
            0
        );

        _forwardFee(msg.value);
        emit NameRegistered(label, labelHash, msg.sender, msg.value);
    }

    /// @notice Namehash of `label.xp`.
    function namehashOf(string calldata label) external pure returns (bytes32) {
        return Namehash.labelNode(label);
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        emit PriceChanged(price, newPrice);
        price = newPrice;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "XpRegistrar: treasury=0");
        emit TreasuryChanged(treasury, newTreasury);
        treasury = newTreasury;
    }

    function setDefaultResolver(address resolver_) external onlyOwner {
        require(resolver_ != address(0), "XpRegistrar: resolver=0");
        defaultResolver = resolver_;
        emit DefaultResolverChanged(resolver_);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "XpRegistrar: owner=0");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function _forwardFee(uint256 amount) internal {
        if (amount == 0) return;
        (bool ok, ) = treasury.call{value: amount}("");
        require(ok, "XpRegistrar: treasury transfer failed");
    }

    /// @dev Lowercase alphanumeric + hyphen, length 3–32, no leading/trailing hyphen.
    function _validLabel(string calldata label) internal pure returns (bool) {
        bytes memory b = bytes(label);
        uint256 len = b.length;
        if (len < 3 || len > 32) return false;
        if (b[0] == 0x2d || b[len - 1] == 0x2d) return false; // '-'

        for (uint256 i = 0; i < len; i++) {
            bytes1 c = b[i];
            bool ok = (c >= 0x61 && c <= 0x7a) || // a-z
                (c >= 0x30 && c <= 0x39) || // 0-9
                c == 0x2d; // -
            if (!ok) return false;
        }
        return true;
    }
}
