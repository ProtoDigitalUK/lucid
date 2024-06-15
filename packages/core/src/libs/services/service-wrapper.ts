import type { Config } from "../../types/config.js";
import type { KyselyDB } from "../db/types.js";
import ServiceTransactionError from "./service-transaction-error.js";

export type ServiceConfig = {
	// Dependencie injection
	db: KyselyDB;
	config: Config;
};

export type ServiceWrapperConfig = {
	transaction: boolean; //* Decides whether the db queries should be within a transaction or not
	// default errors
	// zod schema for validation
};

export type ServiceError = {
	status: number;
	code: string;
	name: string;
	message: string;
};

export type ServiceResponse<T> = Promise<{
	error: ServiceError | undefined;
	data: T | undefined;
}>;

const serviceWrapper =
	<T extends unknown[], R>(
		fn: (serviceConfig: ServiceConfig, ...args: T) => ServiceResponse<R>,
		wrapperConfig: ServiceWrapperConfig,
	) =>
	async (serviceConfig: ServiceConfig, ...args: T): ServiceResponse<R> => {
		try {
			//* If transactions are not enabled or the serviceConfig is already in a transaction via a parent
			if (!wrapperConfig.transaction || serviceConfig.db.isTransaction) {
				return await fn(serviceConfig, ...args);
			}

			//* If transactions are enabled
			return await serviceConfig.db.transaction().execute(async (tx) => {
				const result = await fn(
					{
						...serviceConfig,
						db: tx,
					},
					...args,
				);
				if (result.error) {
					//! Kysely needs function to throw for transaction to rollback !\\
					throw new ServiceTransactionError(result.error);
				}

				return result;
			});
		} catch (error) {
			if (error instanceof ServiceTransactionError) {
				return {
					error: error.error,
					data: undefined,
				};
			}

			// TODO: move error messages to translations and update copy
			if (error instanceof Error) {
				return {
					error: {
						status: 500,
						code: "internal",
						name: "Internal Server Error",
						message:
							error.message ??
							"An internal server error occurred",
					},
					data: undefined,
				};
			}

			// TODO: move error messages to translations and update copy
			return {
				error: {
					status: 500,
					code: "internal",
					name: "Internal Server Error",
					message: "An internal server error occurred",
				},
				data: undefined,
			};
		}
	};

export default serviceWrapper;
