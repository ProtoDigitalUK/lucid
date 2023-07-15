import { PoolClient } from "pg";
import { getDBClient } from "@db/db";

/**
 * This module exports a higher-order function `service` which is used to
 * wrap all database related service functions in the application.
 *
 * @param fn - The function to be wrapped. This function should include any database
 * operations that need to be performed. It receives the database client and any
 * additional parameters.
 *
 * @param transaction - A boolean indicating whether the operations inside `fn`
 * should be performed inside a database transaction. If `true`, and if an error
 * occurs during execution of `fn`, all changes made within the transaction will be
 * rolled back.
 *
 * @param outerClient - An optional parameter that allows for a database client to be
 * provided. If not provided, a new client will be obtained from the pool and released
 * after `fn` has been executed. This is useful for situations where multiple services
 * are called within each other, and they should all share the same client. If a client
 * is passed in, it will not be released; it's up to the caller to release the client.
 *
 * The wrapped function returns a Promise resolving to the return value of `fn`, or it
 * throws an error if an error occurred.
 */

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
