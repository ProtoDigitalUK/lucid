import type { ServiceError } from "./service-wrapper.js";

class ServiceTransactionError extends Error {
	error: ServiceError;
	constructor(error: ServiceError) {
		super(error.message);
		this.error = error;
	}
}

export default ServiceTransactionError;
