// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NTNFTERC1155Token is ERC1155, Ownable {
    // 定义 NFT 的唯一 ID
    uint256 public constant UNIQUE_NFT_ID = 1;
    uint256 public constant FUNGIBLE_TOKEN_ID = 2;
    // 存储每个代币 ID 的总供应量
    mapping(uint256 => uint256) private _totalSupply;

    constructor() ERC1155("https://token-cdn-domain/{id}.json") Ownable(msg.sender) {}

    // 铸造 NFT
    function mintUniqueToken(address to) public onlyOwner {
        require(_totalSupply[UNIQUE_NFT_ID] == 0, "NFT already minted");
        _mint(to, UNIQUE_NFT_ID, 1, "");
        _totalSupply[UNIQUE_NFT_ID] = 1; // 更新总供应量
    }

    // 铸造同质化代币
    function mintFungibleTokens(address to, uint256 amount) public onlyOwner {
        _mint(to, FUNGIBLE_TOKEN_ID, amount, "");
        _totalSupply[FUNGIBLE_TOKEN_ID] += amount; // 更新总供应量
    }

    // 检查是否为 NFT
    function isNonFungible(uint256 id) public pure returns (bool) {
        // 这里我们简单地假设某些特定 id 是 NFT
        return id == UNIQUE_NFT_ID;
    }

    // 查询给定 ID 的代币是否为 NFT
    function checkIfNonFungibleToken(uint256 id) public view returns (bool) {
        // 如果该代币的总供应量是 1，并且是特定 ID，则它是 NFT
        return isNonFungible(id) && totalSupply(id) == 1;
    }

    // 计算给定 ID 的代币总供应量
    function totalSupply(uint256 id) public view returns (uint256) {
        return _totalSupply[id];
    }
}
