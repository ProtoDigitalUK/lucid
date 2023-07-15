import { PoolClient } from "pg";
import { getDBClient } from "@db/db";

const service =
  <T extends any[], R>(
    fn: (client: PoolClient, ...args: T) => Promise<R>,
    transaction: boolean, // whether or not to wrap the function in a transaction to handle rollbacks
    outerClient?: PoolClient // if you already have a client, pass it in here - used for nested services
  ) =>
  async (...args: T): Promise<R> => {
    let client: PoolClient;
    let shouldReleaseClient = false;

    if (outerClient) {
      // If an outer client was provided, use it and don't release it when done
      client = outerClient;
    } else {
      // If no outer client was provided, get a new one and plan to release it when done
      client = await getDBClient();
      shouldReleaseClient = true;
    }

    try {
      if (transaction) await client.query("BEGIN");
      const result = await fn(client, ...args);
      if (transaction) await client.query("COMMIT");
      return result;
    } catch (error) {
      if (transaction) await client.query("ROLLBACK");
      throw error;
    } finally {
      if (shouldReleaseClient) {
        console.log("releasing client");
        client.release();
      }
    }
  };

export default service;
