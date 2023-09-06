import { Pool } from "pg";
import Config from "../services/Config.js";
let pool;
const initializePool = async () => {
    const config = await Config.getConfig();
    pool = new Pool({
        connectionString: config.postgresURL,
        max: 20,
        ssl: {
            rejectUnauthorized: false,
        },
    });
};
const getDBClient = () => {
    if (!pool) {
        throw new Error("Database connection pool is not initialized. Call initializePool() before getDBClient().");
    }
    return pool.connect();
};
export { initializePool, getDBClient };
//# sourceMappingURL=db.js.map