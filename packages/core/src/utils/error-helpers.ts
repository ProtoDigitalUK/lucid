import type { LucidAPIErrorData } from "../types/errors.js";
import { LucidAPIError } from "./error-handler.js";
import constants from "../constants.js";

export const ensureThrowAPIError = (
	error: LucidAPIError | Error | unknown,
	data: LucidAPIErrorData,
) => {
	if (error instanceof LucidAPIError) {
		error.setMissingValues({
			name: data.name,
			message: data.message,
			code: data.code,
		});
		throw error;
	}

	if (error instanceof Error) {
		throw new LucidAPIError({
			type: data.type,
			name: data.name,
			message: error.message || data.message,
			status: data.status,
			code: data.code,
			errorResponse: data.errorResponse,
			zod: data.zod,
		});
	}

	throw new LucidAPIError(data);
};

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
