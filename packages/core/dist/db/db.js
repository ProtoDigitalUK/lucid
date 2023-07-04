"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: process.env.LUCID_POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
client.connect();
exports.default = client;
//# sourceMappingURL=db.js.map