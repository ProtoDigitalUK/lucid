"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("../../db/db.js");
const service = (fn, transaction, outerClient) => async (...args) => {
    let client;
    let shouldReleaseClient = false;
    if (outerClient) {
        client = outerClient;
    }
    else {
        client = await (0, db_js_1.getDBClient)();
        shouldReleaseClient = true;
    }
    try {
        if (transaction)
            await client.query("BEGIN");
        const result = await fn(client, ...args);
        if (transaction)
            await client.query("COMMIT");
        return result;
    }
    catch (error) {
        if (transaction)
            await client.query("ROLLBACK");
        throw error;
    }
    finally {
        if (shouldReleaseClient) {
            client.release();
        }
    }
};
exports.default = service;
//# sourceMappingURL=service.js.map