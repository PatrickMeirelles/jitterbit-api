const fs = require("fs");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function executeSqlScript(filename) {
  try {
    await client.connect();
    const sql = fs.readFileSync(filename).toString();
    await client.query(sql);
    console.log("Script executed");
  } catch (err) {
    console.error("it shouldn't happen:", err);
  } finally {
    await client.end();
  }
}

executeSqlScript("./tables.sql");
