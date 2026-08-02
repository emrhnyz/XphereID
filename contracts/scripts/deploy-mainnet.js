/**
 * XphereID — Mainnet deploy
 *
 * Same order as testnet:
 *  1) ENSRegistry
 *  2) PublicResolver(registry)
 *  3) XpRegistrar(registry, treasury, price, resolver)
 *  4) XphereID(registry)
 *  5) registry.setSubnodeOwner(root, labelhash("xp"), registrar)
 *
 * Usage (from /contracts, after filling .env — do not paste keys in chat):
 *   npx hardhat run scripts/deploy-mainnet.js --network xphereMainnet
 *
 * Keep REGISTER_PRICE_WEI low for the grant demo (default 0.01 XP).
 */

const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No deployer account. Set PRIVATE_KEY in contracts/.env then retry."
    );
  }

  const treasury = process.env.TREASURY_ADDRESS;
  if (!treasury || !ethers.isAddress(treasury)) {
    throw new Error(
      "Set TREASURY_ADDRESS in contracts/.env to a valid address."
    );
  }

  // Low grant-demo fee on mainnet too — override with REGISTER_PRICE_WEI if needed.
  const price = process.env.REGISTER_PRICE_WEI
    ? BigInt(process.env.REGISTER_PRICE_WEI)
    : ethers.parseEther("0.01");

  const network = await ethers.provider.getNetwork();
  const expectedChainId = 20250217n;
  if (network.chainId !== expectedChainId) {
    throw new Error(
      `Expected Xphere Mainnet chainId ${expectedChainId}, got ${network.chainId}`
    );
  }

  console.log("Network chainId:", network.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("Treasury:", treasury);
  console.log("Register price (wei):", price.toString());
  console.log("Register price (XP):", ethers.formatEther(price));

  console.log("\n[1/5] Deploying ENSRegistry...");
  const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
  const registry = await ENSRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("  ENSRegistry:", registryAddress);

  console.log("\n[2/5] Deploying PublicResolver...");
  const PublicResolver = await ethers.getContractFactory("PublicResolver");
  const resolver = await PublicResolver.deploy(registryAddress);
  await resolver.waitForDeployment();
  const resolverAddress = await resolver.getAddress();
  console.log("  PublicResolver:", resolverAddress);

  console.log("\n[3/5] Deploying XpRegistrar...");
  const XpRegistrar = await ethers.getContractFactory("XpRegistrar");
  const registrar = await XpRegistrar.deploy(
    registryAddress,
    treasury,
    price,
    resolverAddress
  );
  await registrar.waitForDeployment();
  const registrarAddress = await registrar.getAddress();
  console.log("  XpRegistrar:", registrarAddress);

  console.log("\n[4/5] Deploying XphereID...");
  const XphereID = await ethers.getContractFactory("XphereID");
  const xphereId = await XphereID.deploy(registryAddress);
  await xphereId.waitForDeployment();
  const xphereIdAddress = await xphereId.getAddress();
  console.log("  XphereID:", xphereIdAddress);

  console.log("\n[5/5] Assigning .xp node to XpRegistrar...");
  const xpLabelhash = ethers.keccak256(ethers.toUtf8Bytes("xp"));
  const tx = await registry.setSubnodeOwner(
    ethers.ZeroHash,
    xpLabelhash,
    registrarAddress
  );
  const receipt = await tx.wait();
  console.log("  setSubnodeOwner tx:", receipt.hash);

  const baseNode = await registrar.baseNode();
  const deployment = {
    network: "Xphere Mainnet",
    chainId: Number(network.chainId),
    rpc: process.env.RPC_MAINNET || "https://en-hkg.x-phere.com",
    explorer: "https://xp.tamsa.io",
    deployer: deployer.address,
    treasury,
    registerPriceWei: price.toString(),
    registerPriceXp: ethers.formatEther(price),
    tld: ".xp",
    baseNode,
    deployBlock: Number(receipt.blockNumber),
    contracts: {
      ENSRegistry: registryAddress,
      PublicResolver: resolverAddress,
      XpRegistrar: registrarAddress,
      XphereID: xphereIdAddress,
    },
    transactions: {
      setXpOwner: receipt.hash,
    },
    deployedAt: new Date().toISOString(),
    feeNote: "Intentionally low registration fee for grant demo / public good.",
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "mainnet.json");
  fs.writeFileSync(outFile, JSON.stringify(deployment, null, 2) + "\n");
  console.log("\nWrote", outFile);
  console.log(JSON.stringify(deployment.contracts, null, 2));
  console.log(
    "\nDone. Copy addresses into web/src/config/contracts.ts (mainnetDeployment)"
  );
  console.log("and set NEXT_PUBLIC_NETWORK=mainnet in web/.env.local");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
