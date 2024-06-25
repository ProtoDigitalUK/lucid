import T from "../../translations/index.js";
import { LucidAPIError } from "./index.js";
import constants from "../../constants/constants.js";
import type { LucidErrorData } from "../../types.js";

const decodeError = (error: Error): LucidErrorData => {
	if (error instanceof LucidAPIError) {
		return {
			name: error.name,
			message: error.message,
			status: error.status,
			errorResponse: error.errorResponse,
			code: error.code,
		};
	}

	// @ts-expect-error
	if (error?.statusCode === 429) {
		return {
			code: "rate_limit",
			name: T("rate_limit_error_name"),
			message: error.message || constants.errors.message,
			status: 429,
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

export default decodeError;
