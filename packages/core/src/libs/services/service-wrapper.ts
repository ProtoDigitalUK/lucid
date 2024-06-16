import TransactionError from "./utils/transaction-error.js";
import mergeServiceError from "./utils/merge-errors.js";
import type {
	ServiceConfig,
	ServiceWrapperConfig,
	ServiceResponse,
	ServiceFn,
} from "./types.js";

const serviceWrapper =
	<T extends unknown[], R>(
		fn: ServiceFn<T, R>,
		wrapperConfig: ServiceWrapperConfig,
	) =>
	async (service: ServiceConfig, ...args: T): ServiceResponse<R> => {
		try {
			//* Validate input if a schema is provided
			if (wrapperConfig.schema) {
				const result = await wrapperConfig.schema.safeParseAsync(
					args[wrapperConfig.schemaArgIndex ?? 0],
				);
				if (result.success === false) {
					return {
						error: mergeServiceError(
							{
								type: "validation",
								// message: result.error.message,
								zod: result.error,
							},
							wrapperConfig.defaultError,
						),
						data: undefined,
					};
				}
			}

			//* If transactions are not enabled or the service is already in a transaction via a parent
			if (!wrapperConfig.transaction || service.db.isTransaction) {
				return await fn(service, ...args);
			}

			//* If transactions are enabled
			return await service.db.transaction().execute(async (tx) => {
				const result = await fn(
					{
						...service,
						db: tx,
					},
					...args,
				);
				if (result.error) {
					//! Kysely needs function to throw for transaction to rollback !\\
					throw new TransactionError(result.error);
				}

				return result;
			});
		} catch (error) {
			if (error instanceof TransactionError) {
				return {
					error: mergeServiceError(
						error.error,
						wrapperConfig.defaultError,
					),
					data: undefined,
				};
			}

			if (error instanceof Error) {
				return {
					error: mergeServiceError(
						{
							type: "basic",
							message: error.message,
						},
						wrapperConfig.defaultError,
					),
					data: undefined,
				};
			}

			return {
				error: mergeServiceError(
					{
						type: "basic",
						// @ts-expect-error
						message: error?.message ?? undefined,
					},
					wrapperConfig.defaultError,
				),
				data: undefined,
			};
		}
	};

export default serviceWrapper;
