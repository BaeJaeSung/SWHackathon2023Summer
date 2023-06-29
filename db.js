require("dotenv").config({ path: "./.env" });
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: 3306,
  multipleStatements: true, // set multiple statements
});

module.exports = pool;
