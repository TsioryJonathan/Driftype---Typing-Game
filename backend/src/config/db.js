import postgres from "postgres";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useSSL = process.env.USE_SSL === "true";

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max_connections: 10,
  idle_timeout: 30,
  connect_timeout: 10,
  connection: {
    application_name: "tajotype",
    statement_timeout: 60000,
  },
  types: {
    date: true,
    timestamp: true,
  },
  debug: process.env.NODE_ENV === "development",
});

const initializeDatabase = async () => {
  try {
    const dbPath = path.join(__dirname, "..", "utils", "database.sql");
    const initSql = await fs.readFile(dbPath, "utf8");
    await sql.unsafe(initSql);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Initialize database on startup
initializeDatabase().catch(console.error);

export default sql;
