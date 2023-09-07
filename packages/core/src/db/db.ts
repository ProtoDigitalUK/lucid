import T from "@translations/index.js";
import pg from "pg";
import type { Pool as PoolT } from "pg";
// Services
import Config from "@services/Config.js";

const { Pool } = pg;
let poolVal: PoolT;

const initialisePool = async () => {
  const config = await Config.getConfig();

  poolVal = new Pool({
    connectionString: config.postgresURL,
    max: 20,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  poolVal.on("error", (err) => {
    console.error(T("db_connection_error"), err);
    process.exit(-1);
  });
};

const getDBClient = () => {
  if (!poolVal) {
    throw new Error(T("db_connection_pool_not_initialised"));
  }
  return poolVal.connect();
};

export { initialisePool, getDBClient };
