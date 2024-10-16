// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

// 逻辑合约（Implementation Contract）
contract LogicContract {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}

// 代理合约（Proxy Contract）
contract ProxyContract {
    address public implementation; // 逻辑合约地址

    constructor(address _implementation) {
        implementation = _implementation; // 初始化逻辑合约地址
    }

    // 使用 delegatecall 调用逻辑合约的方法
    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "Implementation contract address not set");

        assembly {
            // 将 calldata 复制到内存中，以便 delegatecall 使用
            calldatacopy(0, 0, calldatasize())

            // delegatecall：使用代理合约的上下文调用目标合约
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)

            // 将返回数据复制到内存中
            returndatacopy(0, 0, returndatasize())

            // 根据结果决定是返回还是回滚
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    // 接收以太币的函数
    receive() external payable {}

    // 设置逻辑合约地址
    function upgradeImplementation(address newImplementation) public {
        implementation = newImplementation;
    }
}
