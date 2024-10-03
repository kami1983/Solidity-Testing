const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreateExample", function () {

  async function deployCreateExampleFixture() {
    const [owner] = await ethers.getSigners();

    const CreateExample = await ethers.getContractFactory("CreateExample");
    const createExample = await CreateExample.deploy();

    return { createExample, owner };
  }

  describe("Contract Deployment", function () {
    it("Should create a new SimpleContract and emit event", async function () {
      const { createExample } = await deployCreateExampleFixture();

      console.log('createExample - address', createExample.target);

      // 
      const valueToSet = 100;

      const tx = await createExample.createContract(valueToSet);
      const receipt = await tx.wait();


      console.log('receipt.logs - ', receipt.logs);

      const log = receipt.logs[0]; // Get the first log
      const parsedLog = createExample.interface.parseLog(log); // Parse the log to get the event object

      // from the event object, we can get the new contract address
      const newContractAddress = parsedLog.args.newContract;

      console.log('New contract address using create(): ', newContractAddress);

      await expect(tx)
          .to.emit(createExample, "NewContractAddress")
          .withArgs(newContractAddress); // We accept any value as `when` arg

      // Connect to the newly created SimpleContract instance
      const SimpleContract = await ethers.getContractFactory("SimpleContract");
      const simpleContractInstance = SimpleContract.attach(newContractAddress);

      // Call the getValue function to get the stored value
      const storedValue = await simpleContractInstance.getValue();

      // Verify that the stored value is equal to the value we set
      expect(storedValue).to.equal(valueToSet);

    });

  });

  // Create 2 
  async function deployCreate2ExampleFixture() {
    const [owner] = await ethers.getSigners();

    // Deploy the Create2Example contract
    const Create2Example = await ethers.getContractFactory("Create2Example");
    const create2Example = await Create2Example.deploy();

    return { create2Example, owner };
  }

  describe("Create2 Contract Deployment", function () {
    it("Should create a new SimpleContract with create2 and emit event", async function () {
      const { create2Example } = await deployCreate2ExampleFixture();

      // Set the value to store in the new contract
      const valueToSet = 100;
      const salt = ethers.keccak256(ethers.toUtf8Bytes("mySalt"));


      // Predict the create2 address from the Create2Example contract
      const predictedAddress = await create2Example.getCreate2Address(valueToSet, salt);

      // Create the new contract using create2
      const tx = await create2Example.create2Contract(valueToSet, salt);
      const receipt = await tx.wait();

      // Validate the new contract address
      const log = receipt.logs[0]; // 获取第一个日志
      const parsedLog = create2Example.interface.parseLog(log); // 解析日志，获取事件对象

      // Gain the new contract address from the event object
      const newContractAddress = parsedLog.args.newContract;

      console.log('- New contract address using create2: ', newContractAddress);
      console.log('- Predicted contract address: ', predictedAddress);

      // Validate that the predicted address is the same as the actual address
      expect(newContractAddress).to.equal(predictedAddress);

      // Validate that the event was emitted and the correct contract address was returned
      await expect(tx)
        .to.emit(create2Example, "NewContractAddress")
        .withArgs(newContractAddress); // 验证新合约地址

      // Validate the value of the new contract
      const SimpleContract = await ethers.getContractFactory("SimpleContract");
      const simpleContractInstance = SimpleContract.attach(newContractAddress);
      const storedValue = await simpleContractInstance.getValue();

      // Verify that the stored value is equal to the value we set
      expect(storedValue).to.equal(valueToSet);
    });

    it("Should predict the correct address using getCreate2Address", async function () {
      const { create2Example } = await deployCreate2ExampleFixture();

      const valueToSet = 100;
      // const salt = ethers.utils.formatBytes32String("mySalt");
      // const salt = ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes("mySalt"), 32); 
      const salt = ethers.keccak256(ethers.toUtf8Bytes("mySalt"));


      // Predict the address of the contract that will be created using create2
      const predictedAddress = await create2Example.getCreate2Address(valueToSet, salt);
      console.log('Predicted contract address: ', predictedAddress);
      
      // Check if the predicted address is a proper address
      expect(predictedAddress).to.properAddress;
    });

  });

});
