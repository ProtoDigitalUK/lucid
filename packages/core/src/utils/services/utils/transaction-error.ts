import type { LucidErrorData } from "../../../types/errors.js";

class TransactionError extends Error {
	error: LucidErrorData;
	constructor(error: LucidErrorData) {
		super(error.message);
		this.error = error;
	}
}

export default TransactionError;
