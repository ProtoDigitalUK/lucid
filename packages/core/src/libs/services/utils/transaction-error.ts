import type { ServiceError } from "../types.js";

class TransactionError extends Error {
	error: ServiceError;
	constructor(error: ServiceError) {
		super(error.message);
		this.error = error;
	}
}

export default TransactionError;
