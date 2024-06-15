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

async function connect() {
  try {
    await client.connect();
    console.log("Connected");
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}

module.exports = {
  client,
  connect,
};
