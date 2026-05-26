const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");

// Enable WebSocket support for the Neon serverless driver
neonConfig.webSocketConstructor = ws;

// Create a connection pool using the DATABASE_URL from environment
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Helper function to run parameterized SQL queries.
 * @param {string}  text   - SQL query string with $1, $2 … placeholders
 * @param {Array}   params - Values bound to the placeholders
 * @returns {Promise<import("@neondatabase/serverless").QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
