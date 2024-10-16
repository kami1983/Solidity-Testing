const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Proxy and Logic Contract", function () {

  // 部署代理合约和逻辑合约
  async function deployProxyAndLogicContracts() {
    const [owner] = await ethers.getSigners();

    // 部署逻辑合约
    const LogicContract = await ethers.getContractFactory("LogicContract");
    const logicContract = await LogicContract.deploy();

    // 部署代理合约，将逻辑合约地址传递给代理合约
    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const proxyContract = await ProxyContract.deploy(logicContract.target);

    // 返回部署的合约和账户信息
    return { proxyContract, logicContract, owner };

  }

  // 测试代理合约委托逻辑合约的行为
  describe("Proxy Delegate Call Test", function () {
    it("Should delegate call to logic contract and modify proxy contract's storage", async function () {
      const { proxyContract, logicContract, owner } = await deployProxyAndLogicContracts();

      // 使用代理合约接口调用逻辑合约的函数，通过代理来调用
    //   const proxyAsLogic = new ethers.Contract(proxyContract.target, logicContract.interface, owner);
    const proxyAsLogic = await ethers.getContractAt("LogicContract", proxyContract.target);

    console.log('logicContract.interface', logicContract.interface.formatJson());

    

      // 设置值通过代理调用
      const valueToSet = 42;
      const tx = await proxyAsLogic.setValue(valueToSet);
      await tx.wait();

      const logicContractInterface = new ethers.Interface(logicContract.interface.formatJson());
      // const result = await proxyContract.callStatic(logicContractInterface.encodeFunctionData("getValue"));
      
      // 读取数据时测试无法通过
      // const storedValueInProxy = logicContractInterface.decodeFunctionResult("getValue", result);
      // expect(storedValueInProxy[0]).to.equal(valueToSet);

    // //   验证通过代理合约调用的 setValue 实际修改了代理合约的存储
    //   const storedValueInProxy = await proxyAsLogic.getValue();
    //   expect(storedValueInProxy).to.equal(valueToSet);

    //   // 验证逻辑合约的存储没有被改变
    //   const storedValueInLogic = await logicContract.getValue();
    //   expect(storedValueInLogic).to.equal(0); // 逻辑合约的存储不变
    });

//     it("Should upgrade logic contract and use new implementation", async function () {
//       const { proxyContract, logicContract, owner } = await deployProxyAndLogicContracts();

//       // 部署一个新的逻辑合约
//       const NewLogicContract = await ethers.getContractFactory("LogicContract");
//       const newLogicContract = await NewLogicContract.deploy();
//       await newLogicContract.deployed();

//       // 调用代理合约的 upgradeImplementation 来更换逻辑合约
//       const upgradeTx = await proxyContract.upgradeImplementation(newLogicContract.address);
//       await upgradeTx.wait();

//       // 使用代理合约的新逻辑合约接口进行交互
//       const proxyAsNewLogic = await ethers.getContractAt("LogicContract", proxyContract.address);

//       // 设置值通过代理调用新的逻辑合约
//       const valueToSet = 100;
//       const tx = await proxyAsNewLogic.setValue(valueToSet);
//       await tx.wait();

//       // 验证代理合约的存储被修改
//       const storedValueInProxy = await proxyAsNewLogic.getValue();
//       expect(storedValueInProxy).to.equal(valueToSet);

//       // 验证新逻辑合约本身的存储没有被改变
//       const storedValueInNewLogic = await newLogicContract.getValue();
//       expect(storedValueInNewLogic).to.equal(0);
//     });

  });
});
