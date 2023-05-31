"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const Config_1 = __importDefault(require("../services/Config"));
const client = new pg_1.Client({
    connectionString: Config_1.default.databaseUrl,
    ssl: {
        rejectUnauthorized: false,
    },
});
client.connect();
exports.default = client;
//# sourceMappingURL=db.js.map