"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const Config_1 = __importDefault(require("./models/Config"));
const getDBClient = async () => {
    const config = await Config_1.default.getConfig();
    const client = new pg_1.Client({
        connectionString: config.postgresURL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    return client.connect().then(() => client);
};
exports.default = getDBClient();
//# sourceMappingURL=db.js.map