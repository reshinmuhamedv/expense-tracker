require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { query } = require("./config/db");

async function initDb() {
  try {
    const sqlPath = path.join(__dirname, "db", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    console.log("Executing init.sql...");
    await query(sql, []);
    console.log("Database initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDb();
