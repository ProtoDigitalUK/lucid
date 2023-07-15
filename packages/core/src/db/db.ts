import { Pool } from "pg";
// Services
import Config from "@services/Config";

let pool: Pool;

const initializePool = async () => {
  const config = await Config.getConfig();

  pool = new Pool({
    connectionString: config.postgresURL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

const getDBClient = () => {
  if (!pool) {
    throw new Error(
      "Database connection pool is not initialized. Call initializePool() before getDBClient()."
    );
  }
  return pool.connect();
};

export { initializePool, getDBClient };
