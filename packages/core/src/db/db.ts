import pg from "pg";
import type { Pool as PoolT } from "pg";
// Services
import Config from "@services/Config.js";

const { Pool } = pg;
let poolVal: PoolT;

const initializePool = async () => {
  const config = await Config.getConfig();

  poolVal = new Pool({
    connectionString: config.postgresURL,
    max: 20,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  poolVal.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });
};

const getDBClient = () => {
  if (!poolVal) {
    throw new Error(
      "Database connection pool is not initialized. Call initializePool() before getDBClient()."
    );
  }
  return poolVal.connect();
};

export { initializePool, getDBClient };
