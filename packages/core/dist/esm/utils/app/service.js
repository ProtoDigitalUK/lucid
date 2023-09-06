import { getDBClient } from "../../db/db.js";
const service = (fn, transaction, outerClient) => async (...args) => {
    let client;
    let shouldReleaseClient = false;
    if (outerClient) {
        client = outerClient;
    }
    else {
        client = await getDBClient();
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
export default service;
//# sourceMappingURL=service.js.map