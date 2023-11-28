const { ethers } = require("hardhat");
const { storeData } = require("./storeData.js");

async function main() {
  // using seperate accounts for `admin` (of proxy) and `owner` (of token)
  // because the Proxy admin cannot interact with the implementation contract
  const [owner, admin, acc1, acc2] = await ethers.getSigners();
  let txHashes = {
    tetherTokenDeploymentHash: "",
    tupDeploymentHash: "",
    initializeHash: "",
    mintingHash: "",
    transferHash: "",
  };

  const TetherToken = await ethers.getContractFactory("TetherToken");
  let tetherToken = await TetherToken.deploy();
  let tx = await tetherToken.deployed();
  txHashes.tetherTokenDeploymentHash = tx.deployTransaction.hash;

  const TUP = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const tup = await TUP.deploy(tetherToken.address, admin.address, "0x");
  tx = await tup.deployed();
  txHashes.tupDeploymentHash = tx.deployTransaction.hash;

  console.log(
    `TetherToken implementation deployed to ${tetherToken.address} at tx ${txHashes.tetherTokenDeploymentHash}`
  );

  tetherToken = await ethers.getContractAt("TetherToken", tup.address);
  // owner initializes the TetherToken contract
  tx = await tetherToken.connect(owner).initialize("TetherToken", "USDt", 6);
  await tx.wait();
  txHashes.initializeHash = tx.hash;

  console.log(
    `TUP deployed to ${tup.address} at tx ${txHashes.tupDeploymentHash}`
  );

  console.log();
  // checking balance of acc1
  await logBalance(acc1);

  // owner mints 100 USDT to acc1
  process.stdout.write("owner mints 100 USDT to acc1...");
  tx = await tetherToken.connect(owner).mint(acc1.address, 100);
  await tx.wait();
  console.log("tx: ", tx.hash);
  txHashes.mintingHash = tx.hash;
  // checking balance of acc1
  await logBalance(acc1);

  // acc1 transfers 50 USDT to acc2
  process.stdout.write("acc1 transfers 50 USDT to acc2...");
  tx = await tetherToken.connect(acc1).transfer(acc2.address, 50);
  await tx.wait();
  console.log("tx: ", tx.hash);
  txHashes.transferHash = tx.hash;

  // checking balance of acc1 and acc2
  await logBalance(acc1);
  await logBalance(acc2);

  async function logBalance(acc) {
    console.log(
      `balance of ${acc == acc1 ? "acc1" : "acc2"} is ${(
        await tetherToken.balanceOf(acc.address)
      ).toNumber()}`
    );
  }

  storeData(txHashes);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
