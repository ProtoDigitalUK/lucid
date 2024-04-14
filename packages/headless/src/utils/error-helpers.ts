import type { HeadlessAPIErrorData } from "../types/errors.js";
import { HeadlessAPIError } from "./error-handler.js";
import constants from "../constants.js";

export const ensureThrowAPIError = (
	error: HeadlessAPIError | Error | unknown,
	data: HeadlessAPIErrorData,
) => {
	if (error instanceof HeadlessAPIError) {
		error.setMissingValues({
			name: data.name,
			message: data.message,
		});
		throw error;
	}

	if (error instanceof Error) {
		throw new HeadlessAPIError({
			type: data.type,
			name: data.name,
			message: error.message || data.message,
			status: data.status,
			code: data.code,
			errorResponse: data.errorResponse,
			zod: data.zod,
		});
	}

	throw new HeadlessAPIError(data);
};

export const decodeError = (error: Error) => {
	if (error instanceof HeadlessAPIError) {
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
