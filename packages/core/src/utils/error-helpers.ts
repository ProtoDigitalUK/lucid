import { LucidAPIError } from "./error-handler.js";
import constants from "../constants/constants.js";

export const decodeError = (error: Error) => {
	if (error instanceof LucidAPIError) {
		return {
			name: error.name,
			message: error.message,
			status: error.status,
			errorResponse: error.errorResponse,
			code: error.code,
		};
	}

	return {
		name: constants.errors.name,
		message: error.message || constants.errors.message,
		status: constants.errors.status,
		errorResponse: constants.errors.errorResponse,
		code: constants.errors.code,
	};
};
