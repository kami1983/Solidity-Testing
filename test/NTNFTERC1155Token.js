const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NTNFTERC1155Token", function () {
  // Fixture 用于部署合约并返回其实例
  async function deployCustomERC1155TokenFixture() {
    const [owner, user] = await ethers.getSigners();

    const CustomERC1155Token = await ethers.getContractFactory("NTNFTERC1155Token");
    const customERC1155Token = await CustomERC1155Token.deploy();

    return { customERC1155Token, owner, user };
  }

  describe("Contract Deployment", function () {
    it("Should deploy CustomERC1155Token contract", async function () {
      const { customERC1155Token } = await deployCustomERC1155TokenFixture();
      expect(customERC1155Token.target).to.properAddress;
    });
  });

  describe("Minting and Supply", function () {
    it("Should mint a unique NFT and check total supply", async function () {
      const { customERC1155Token, owner, user } = await deployCustomERC1155TokenFixture();

      // 铸造唯一的 NFT
      await customERC1155Token.mintUniqueToken(user.address);

      // 检查代币的总供应量
      const totalSupply = await customERC1155Token.totalSupply(1);
      expect(totalSupply).to.equal(1);

      // 检查用户的代币余额
      const userBalance = await customERC1155Token.balanceOf(user.address, 1);
      expect(userBalance).to.equal(1);

      // 检查是否为非同质化代币
      const isNFT = await customERC1155Token.isNonFungible(1);
      expect(isNFT).to.be.true;
    });

    it("Should mint fungible tokens and check total supply", async function () {
      const { customERC1155Token, owner, user } = await deployCustomERC1155TokenFixture();

      // 铸造同质化代币
      const amountToMint = 100;
      await customERC1155Token.mintFungibleTokens(user.address, amountToMint);

      // 检查代币的总供应量
      const totalSupply = await customERC1155Token.totalSupply(2);
      expect(totalSupply).to.equal(amountToMint);

      // 检查用户的代币余额
      const userBalance = await customERC1155Token.balanceOf(user.address, 2);
      expect(userBalance).to.equal(amountToMint);

      // 检查是否为非同质化代币
      const isNFT = await customERC1155Token.isNonFungible(2);
      expect(isNFT).to.be.false;  // 这是同质化代币
    });
  });

});
