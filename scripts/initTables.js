const mysql = require("mysql2");
require("dotenv").config();

const con = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: "bitzees_task",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected!");

  // create deployment table
  let sql =
    "CREATE TABLE deployments (contractName VARCHAR(255), _from VARCHAR(42), contractAddress VARCHAR(42), _hash VARCHAR(66))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("deployments table created!");
  });
  // create interactions table
  sql =
    "CREATE TABLE interactions (funcName VARCHAR(255), _from VARCHAR(42), _to VARCHAR(42), _hash VARCHAR(66))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("interactions table created!");
  });
});
