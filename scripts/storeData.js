const axios = require("axios");
const mysql = require("mysql2");
require("dotenv").config();

const con = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: "bitzees_task",
});

async function storeData(txHashes) {
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
  console.log("fetching data...");
  let response = await axios.get(
    "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=proxy&action=eth_getTransactionReceipt&txhash=0x56f6e794323d0ac0f0819b4b9561e611f3bb53896a7ddddacbcd62661b1b53e6"
  );
  dbData.tetherTokenDeployment.contractName = "TetherToken";
  dbData.tetherTokenDeployment.from = response.data.result.from;
  dbData.tetherTokenDeployment.contractAddress =
    response.data.result.contractAddress;
  dbData.tetherTokenDeployment.hash = response.data.result.transactionHash;
  response = await axios.get(
    "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=proxy&action=eth_getTransactionReceipt&txhash=0x3391a0b9b0759c38e59c6e9e913fb4867f31e34f911326a78941d7466dc491f3"
  );
  dbData.tupDeployment.contractName = "TransparentUpgradeableProxy";
  dbData.tupDeployment.from = response.data.result.from;
  dbData.tupDeployment.contractAddress = response.data.result.contractAddress;
  dbData.tupDeployment.hash = response.data.result.transactionHash;

  response = await axios.get(
    "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=proxy&action=eth_getTransactionByHash&txhash=0x33d60160d82fbe0096d1851e79e44103ff31cab390dd04eded7afd1a98b7a9dd"
  );
  dbData.initialize.funcName = "initialize";
  dbData.initialize.from = response.data.result.from;
  dbData.initialize.to = response.data.result.to;
  dbData.initialize.hash = response.data.result.hash;
  response = await axios.get(
    "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=proxy&action=eth_getTransactionByHash&txhash=0xe18f050f153f88f0abc8a845050f34ce1b25fb23d0eaedd69975186a32c44963"
  );
  dbData.minting.funcName = "mint";
  dbData.minting.from = response.data.result.from;
  dbData.minting.to = response.data.result.to;
  dbData.minting.hash = response.data.result.hash;
  response = await axios.get(
    "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=proxy&action=eth_getTransactionByHash&txhash=0xb1fdadb43d37b7d0da65634c25b26e13558299f157d4b7992c789488520e1a40"
  );
  dbData.transfer.funcName = "transfer";
  dbData.transfer.from = response.data.result.from;
  dbData.transfer.to = response.data.result.to;
  dbData.transfer.hash = response.data.result.hash;

  console.log("storing into db...");
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

module.exports = { storeData };
