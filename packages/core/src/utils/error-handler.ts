import T from "../translations/index.js";
import lucidLogger from "../libs/logging/index.js";
import type z from "zod";
import type { ErrorResult, LucidErrorData } from "../types/errors.js";

/**
 * The LucidAPIError class should be used to throw errors within the API request lifecycle. This will be caught by Fastify's error handler and will return a formatted error response. If the error is a Zod error, it will be formatted into a more readable format.
 * @class
 * @extends Error
 * @param {LucidErrorData["type"]} data.type - The type of error
 * @param {string} [data.name] - The error name
 * @param {string} [data.message] - The error message
 * @param {number} [data.status] - The HTTP status code
 * @param {LucidErrorData["code"]} [data.code] - The error code
 * @param {z.ZodError} [data.zod] - The Zod error object - this is formatted and stored in the errors property
 * @param {ErrorResult} [data.errorResponse] - The error result object - this is returned in the response
 * @returns {void}
 * @example
 * throw new LucidAPIError({
 *    type: "basic",
 *    name: "Fetch User Error",
 *    message: "Error while fetching user data",
 *    status: 500,
 * });
 * @example
 * throw new LucidAPIError({
 *    type: "validation",
 *    name: "Validation Error",
 *    message: "Validation error occurred",
 *    status: 400,
 *    errorResponse: {
 *        body: {
 *            email: {
 *                code: "invalid_email",
 *                message: "Invalid email address",
 *            },
 *        },
 *    },
 * });
 */
export class LucidAPIError extends Error {
	type: LucidErrorData["type"] = "basic";
	code: LucidErrorData["code"];
	errorResponse: LucidErrorData["errorResponse"];
	status: LucidErrorData["status"];
	constructor(data: LucidErrorData) {
		super(data.message);
		this.type = data.type;
		this.code = data.code;
		this.errorResponse = data.errorResponse;
		this.status = data.status;
		this.name = data.name ?? "";

		if (data.zod !== undefined) {
			this.errorResponse = LucidAPIError.formatZodErrors(
				data.zod?.issues || [],
			);
		}

		switch (data.type) {
			case "validation": {
				if (data.status === undefined) this.status = 400;
				if (data.name === undefined) this.name = T("validation_error");
				break;
			}
			case "authorisation": {
				if (data.status === undefined) this.status = 401;
				if (data.name === undefined)
					this.name = T("authorisation_error");
				break;
			}
			case "forbidden": {
				if (data.status === undefined) this.status = 403;
				if (data.name === undefined) this.name = T("forbidden_error");
				break;
			}
			default: {
				if (data.status === undefined) this.status = 500;
				break;
			}
		}
	}
	// static
	static formatZodErrors(error: z.ZodIssue[]) {
		const result: ErrorResult = {};

		for (const item of error) {
			let current = result;
			for (const key of item.path) {
				if (typeof key === "number") {
					// @ts-expect-error
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current.children || (current.children = []);
					// @ts-expect-error
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current[key] || (current[key] = {});
				} else {
					// @ts-expect-error
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current[key] || (current[key] = {});
				}
			}
			current.code = item.code;
			current.message = item.message;
		}

		return result ?? undefined;
	}
}

/**
 * The LucidError class should be used to throw errors in functions that sit outside of API request lifecycle. This class will log the error and optionally kill the process.
 * @class
 * @extends Error
 * @param {string} data.message - The error message
 * @param {string} [data.scope] - Used to identify the scope of the logged error
 * @param {boolean} [data.kill] - If true, the process will exit with code 1
 * @returns {void}
 * @example
 * throw new LucidError({
 *     message: "Cannot set a value to a read-only property",
 *     scope: "plugin-name",
 *     kill: true,
 * });
 */
export class LucidError extends Error {
	scope?: string;
	kill?: boolean;
	constructor(data: {
		message: string;
		scope?: string;
		kill?: boolean;
		data?: Record<string, unknown>;
	}) {
		super(data.message);
		this.scope = data.scope;
		this.kill = data.kill;

		lucidLogger("error", {
			message: this.message,
			scope: this.scope,
			data: data.data ?? undefined,
		});

		if (this.kill) process.exit(1);
	}
}
