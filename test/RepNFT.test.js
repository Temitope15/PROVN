const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RepNFT", function () {
  let repNFT, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const RepNFT = await ethers.getContractFactory("RepNFT");
    repNFT = await RepNFT.deploy();
    await repNFT.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await repNFT.name()).to.equal("RepNFT");
    expect(await repNFT.symbol()).to.equal("REP");
  });

  it("should allow owner to mint", async function () {
    await repNFT.mint(addr1.address);
    expect(await repNFT.ownerOf(0)).to.equal(addr1.address);
  });

  it("should reject minting from non-owner", async function () {
    await expect(
      repNFT.connect(addr1).mint(addr1.address)
    ).to.be.revertedWithCustomError(repNFT, "OwnableUnauthorizedAccount");
  });
});
