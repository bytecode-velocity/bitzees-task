const mysql = require("mysql2");
require("dotenv").config();

const con = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected!");

  // create bitzees_task database
  con.query("CREATE DATABASE bitzeees_task", function (err, result) {
    if (err) throw err;
    console.log("Database created!");
  });
});
