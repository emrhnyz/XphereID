const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("XphereID MVP", function () {
  const PRICE = ethers.parseEther("0.01");
  const LABEL = "alice";

  let deployer, user, treasury;
  let registry, resolver, registrar, xphereId;
  let labelNode;

  beforeEach(async function () {
    [deployer, user, treasury] = await ethers.getSigners();

    const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
    registry = await ENSRegistry.deploy();
    await registry.waitForDeployment();

    const PublicResolver = await ethers.getContractFactory("PublicResolver");
    resolver = await PublicResolver.deploy(await registry.getAddress());
    await resolver.waitForDeployment();

    const XpRegistrar = await ethers.getContractFactory("XpRegistrar");
    registrar = await XpRegistrar.deploy(
      await registry.getAddress(),
      treasury.address,
      PRICE,
      await resolver.getAddress()
    );
    await registrar.waitForDeployment();

    const XphereID = await ethers.getContractFactory("XphereID");
    xphereId = await XphereID.deploy(await registry.getAddress());
    await xphereId.waitForDeployment();

    // Give registrar ownership of `.xp` under the root.
    const xpLabelhash = ethers.keccak256(ethers.toUtf8Bytes("xp"));
    await registry.setSubnodeOwner(
      ethers.ZeroHash,
      xpLabelhash,
      await registrar.getAddress()
    );

    labelNode = await registrar.namehashOf(LABEL);
  });

  it("1) yeni isim register olabiliyor", async function () {
    await registrar.connect(user).register(LABEL, { value: PRICE });

    expect(await registrar.available(LABEL)).to.equal(false);
    expect(await registry.owner(labelNode)).to.equal(user.address);
    expect(await registry.resolver(labelNode)).to.equal(
      await resolver.getAddress()
    );
    expect(await xphereId.owner(LABEL)).to.equal(user.address);
  });

  it("2) aynı isim ikinci kez register revert", async function () {
    await registrar.connect(user).register(LABEL, { value: PRICE });

    let reverted = false;
    try {
      await registrar.connect(deployer).register(LABEL, { value: PRICE });
    } catch (err) {
      reverted = true;
      expect(String(err.message)).to.include("XpRegistrar: taken");
    }
    expect(reverted).to.equal(true);
  });

  it("3) owner setAddr yapabiliyor", async function () {
    await registrar.connect(user).register(LABEL, { value: PRICE });
    await resolver.connect(user).setAddr(labelNode, user.address);

    expect(await resolver.addr(labelNode)).to.equal(user.address);
  });

  it("4) resolve doğru adresi dönüyor", async function () {
    await registrar.connect(user).register(LABEL, { value: PRICE });
    await resolver.connect(user).setAddr(labelNode, user.address);

    expect(await xphereId.resolve(LABEL)).to.equal(user.address);
  });

  it("5) fee treasury'ye gidiyor", async function () {
    const before = await ethers.provider.getBalance(treasury.address);

    await registrar.connect(user).register(LABEL, { value: PRICE });

    const after = await ethers.provider.getBalance(treasury.address);
    expect(after - before).to.equal(PRICE);
  });
});
