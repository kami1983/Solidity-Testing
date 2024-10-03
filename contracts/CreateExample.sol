// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    uint256 public value;

    constructor(uint256 _value) {
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}

contract CreateExample {
    event NewContractAddress(address newContract);

    function createContract(uint256 _value) public returns (address) {
        address newContract;
        bytes memory bytecode = abi.encodePacked(type(SimpleContract).creationCode, abi.encode(_value));
        assembly {
            newContract := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(newContract != address(0), "Contract creation failed");
        emit NewContractAddress(newContract);

        return newContract;
    }
}

contract Create2Example {
    event NewContractAddress(address newContract);

    function create2Contract(uint256 _value, bytes32 _salt) public {
        address newContract;
        bytes memory bytecode = abi.encodePacked(type(SimpleContract).creationCode, abi.encode(_value));
        assembly {
            newContract := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
        }
        require(newContract != address(0), "Contract creation failed");
        emit NewContractAddress(newContract);
    }

    // Helper function to predict address
    function getCreate2Address(uint256 _value, bytes32 _salt) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(type(SimpleContract).creationCode, abi.encode(_value));
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );
        return address(uint160(uint(hash)));
    }
}
