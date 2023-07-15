"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBClient = exports.initializePool = void 0;
const pg_1 = require("pg");
const Config_1 = __importDefault(require("../services/Config"));
let pool;
const initializePool = async () => {
    const config = await Config_1.default.getConfig();
    pool = new pg_1.Pool({
        connectionString: config.postgresURL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
};
exports.initializePool = initializePool;
const getDBClient = () => {
    if (!pool) {
        throw new Error("Database connection pool is not initialized. Call initializePool() before getDBClient().");
    }
    return pool.connect();
};
exports.getDBClient = getDBClient;
//# sourceMappingURL=db.js.map