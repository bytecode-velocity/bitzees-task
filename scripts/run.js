const mysql = require("mysql2");
require("dotenv").config();
const { ethers } = require("hardhat");

const con = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: "bitzees_task",
});

async function main() {
  // using seperate accounts for `admin` (of proxy) and `owner` (of token)
  // because the Proxy admin cannot interact with the implementation contract
  const [owner, admin, acc1, acc2] = await ethers.getSigners();
  let dbData = {
    tetherTokenDeployment: {
      contractName: "",
      from: "",
      contractAddress: "",
      hash: "",
    },
    tupDeployment: {
      contractName: "",
      from: "",
      contractAddress: "",
      hash: "",
    },
    initialize: { funcName: "", from: "", to: "", hash: "" },
    minting: { funcName: "", from: "", to: "", hash: "" },
    transfer: { funcName: "", from: "", to: "", hash: "" },
  };

  const TetherToken = await ethers.getContractFactory("TetherToken");
  let tetherToken = await TetherToken.deploy();
  let tx = await tetherToken.deployed();
  dbData.tetherTokenDeployment.contractName = "TetherToken";
  dbData.tetherTokenDeployment.from = owner.address;
  dbData.tetherTokenDeployment.contractAddress = tetherToken.address;
  dbData.tetherTokenDeployment.hash = tx.deployTransaction.hash;

  const TUP = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const tup = await TUP.deploy(tetherToken.address, admin.address, "0x");
  tx = await tup.deployed();
  dbData.tupDeployment.contractName = "TransparentUpgradeableProxy";
  dbData.tupDeployment.from = owner.address;
  dbData.tupDeployment.contractAddress = tup.address;
  dbData.tupDeployment.hash = tx.deployTransaction.hash;

  console.log(
    `TetherToken implementation deployed to ${tetherToken.address} at tx ${dbData.tetherTokenDeployment.hash}`
  );

  tetherToken = await ethers.getContractAt("TetherToken", tup.address);
  // owner initializes the TetherToken contract
  tx = await tetherToken.connect(owner).initialize("TetherToken", "USDt", 6);
  await tx.wait();
  dbData.initialize.funcName = "initialize";
  dbData.initialize.from = owner.address;
  dbData.initialize.to = tetherToken.address;
  dbData.initialize.hash = tx.hash;

  console.log(
    `TUP deployed to ${tup.address} at tx ${dbData.tupDeployment.hash}`
  );

  console.log();
  // checking balance of acc1
  await logBalance(acc1);

  // owner mints 100 USDT to acc1
  process.stdout.write("owner mints 100 USDT to acc1...");
  tx = await tetherToken.connect(owner).mint(acc1.address, 100);
  await tx.wait();
  console.log("tx: ", tx.hash);
  dbData.minting.funcName = "mint";
  dbData.minting.from = owner.address;
  dbData.minting.to = tetherToken.address;
  dbData.minting.hash = tx.hash;
  // checking balance of acc1
  await logBalance(acc1);

  // acc1 transfers 50 USDT to acc2
  process.stdout.write("acc1 transfers 50 USDT to acc2...");
  tx = await tetherToken.connect(acc1).transfer(acc2.address, 50);
  await tx.wait();
  console.log("tx: ", tx.hash);
  dbData.transfer.funcName = "transfer";
  dbData.transfer.from = acc1.address;
  dbData.transfer.to = tetherToken.address;
  dbData.transfer.hash = tx.hash;

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

  console.log("\nstoring data to the Database!");
  con.connect(function (err) {
    if (err) throw err;
    let sql =
      "INSERT INTO deployments (contractName, _from, contractAddress, _hash) VALUES ?";
    con.query(
      sql,
      [
        [
          [
            dbData.tetherTokenDeployment.contractName,
            dbData.tetherTokenDeployment.from,
            dbData.tetherTokenDeployment.contractAddress,
            dbData.tetherTokenDeployment.hash,
          ],
          [
            dbData.tupDeployment.contractName,
            dbData.tupDeployment.from,
            dbData.tupDeployment.contractAddress,
            dbData.tupDeployment.hash,
          ],
        ],
      ],
      function (err) {
        if (err) throw err;
        console.log("deployment records inserted!");
      }
    );

    sql = "INSERT INTO interactions (funcName, _from, _to, _hash) VALUES ?";
    con.query(
      sql,
      [
        [
          [
            dbData.initialize.funcName,
            dbData.initialize.from,
            dbData.initialize.to,
            dbData.initialize.hash,
          ],
          [
            dbData.minting.funcName,
            dbData.minting.from,
            dbData.minting.to,
            dbData.minting.hash,
          ],
          [
            dbData.transfer.funcName,
            dbData.transfer.from,
            dbData.transfer.to,
            dbData.transfer.hash,
          ],
        ],
      ],
      function (err) {
        if (err) throw err;
        console.log("interaction records inserted!");
      }
    );
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
