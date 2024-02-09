/**
 * This module exports a higher-order function `serviceWrapper` which is used to
 * wrap all database related service functions in the application and is responsible
 * for handling database transactions and rolling back changes if an error occurs.
 *
 * @param fn - The function to be wrapped. This function should include any database
 * operations that need to be performed. It receives the database client and any
 * additional parameters.
 *
 * @param transaction - A boolean indicating whether the operations inside `fn`
 * should be performed inside a database transaction. If `true`, and if an error
 * occurs during execution of `fn`, all changes made within the transaction will be
 * rolled back.
 */

const serviceWrapper =
	<T extends unknown[], R>(
		fn: (serviceConfig: ServiceConfigT, ...args: T) => Promise<R>,
		transaction: boolean, // If the should be wrapped in a transaction
	) =>
	async (serviceConfig: ServiceConfigT, ...args: T): Promise<R> => {
		// If its not a transaction or if the serviceConfig is already in a transaction
		if (!transaction || serviceConfig.inTransaction === true) {
			const result = await fn(serviceConfig, ...args);
			return result;
		}

		// If its a transaction
		return await serviceConfig.db.transaction().execute(async (tx) => {
			const result = await fn({ db: tx, inTransaction: true }, ...args);
			return result;
		});
	};

export default serviceWrapper;
