/*
  When to use APIError:
    - When the error is being thrown from a route or middleware

  When to use HeadlessError:
    - When the error is being thorwn internall and outside of a request. Eg: in a migration or launch step
*/

import type z from "zod";
import { log } from "console-log-colors";
import { ZodError } from "zod";
import T from "../translations/index.js";

const DEFAULT_ERROR = {
	name: T("default_error_name"),
	message: T("default_error_message"),
	status: 500,
	code: null,
	errors: null,
};

// ------------------------------------
// Error Classes
class APIError extends Error {
	code: APIErrorDataT["code"] | null = null;
	status: number;
	errors: ErrorResultT | null = null;
	constructor(data: APIErrorDataT) {
		super(data.message || DEFAULT_ERROR.message);

		switch (data.type) {
			case "validation": {
				this.name = T("validation_error");
				this.status = 400;
				this.#formatZodErrors(data.zod?.issues || []);
				break;
			}
			case "basic": {
				this.name = data.name || DEFAULT_ERROR.name;
				this.status = data.status || DEFAULT_ERROR.status;
				this.errors = data.errors || DEFAULT_ERROR.errors;
				break;
			}
			case "authorisation": {
				this.name = T("authorisation_error");
				this.status = 401;
				break;
			}
			case "forbidden": {
				this.name = T("forbidden_error");
				this.status = 403;
				this.code = data.code || DEFAULT_ERROR.code;
				this.errors = data.errors || DEFAULT_ERROR.errors;
				break;
			}
			default: {
				this.name = DEFAULT_ERROR.name;
				this.status = DEFAULT_ERROR.status;
				this.errors = data.errors || DEFAULT_ERROR.errors;
				break;
			}
		}
	}
	#formatZodErrors(error: z.ZodIssue[]) {
		const result: ErrorResultT = {};

		for (const item of error) {
			let current = result;
			for (const key of item.path) {
				if (typeof key === "number") {
					// @ts-ignore
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current.children || (current.children = []);
					// @ts-ignore
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current[key] || (current[key] = {});
				} else {
					// @ts-ignore
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current[key] || (current[key] = {});
				}
			}
			current.code = item.code;
			current.message = item.message;
		}

		this.errors = result || null;
	}
}

class HeadlessError extends Error {
	plugin?: string;
	hard?: boolean;
	constructor(data: {
		message: string;
		plugin?: string;
		hard?: boolean;
	}) {
		super(data.message);
		this.plugin = data.plugin;
		this.hard = data.hard;
		if (data.plugin === undefined) errorLogger("Headless Error", this);
	}
}

// ------------------------------------
// Util Functions
export const decodeError = (error: Error) => {
	if (error instanceof APIError) {
		return {
			name: error.name,
			message: error.message,
			status: error.status,
			errors: error.errors,
			code: error.code,
		};
	}
	return {
		name: DEFAULT_ERROR.name,
		message: error.message,
		status: DEFAULT_ERROR.status,
		errors: DEFAULT_ERROR.errors,
		code: DEFAULT_ERROR.code,
	};
};

const modelErrors = (error: ErrorResultT): ErrorResultT => {
	return {
		body: error,
	};
};

export const errorLogger = (title: string, err: Error) => {
	log.white("-".repeat(60));
	log.yellow(title);
	log.white("-".repeat(60));

	if (err instanceof ZodError) {
		console.table(
			err.errors.map((error) => {
				return {
					path: error.path.join("."),
					message: error.message,
				};
			}),
		);
	} else if (err instanceof HeadlessError) {
		if (err.plugin !== undefined) {
			log.red(`(${err.plugin}): ${err.message}`);
		} else {
			log.red(err.message);
		}
	} else if (err instanceof Error) {
		log.red(err.message);
	} else {
		log.red(T("an_unknown_error_occurred"));
	}

	log.white("-".repeat(60));
};

// ------------------------------------
// Types
interface APIErrorDataT {
	type: "validation" | "basic" | "forbidden" | "authorisation";

	name?: string;
	message?: string;
	status?: number;
	code?: "csrf";
	zod?: z.ZodError;
	errors?: ErrorResultT;
}

export interface FieldErrorsT {
	brick_id: string | number | undefined;
	group_id: string | number | undefined;
	key: string;
	language_id: number;
	message: string;
}

export interface ErrorResultT {
	code?: string;
	message?: string;
	children?: Array<undefined | ErrorResultT | null>;

	[key: string]:
		| Array<undefined | ErrorResultT | null>
		| string
		| undefined
		| ErrorResultT
		| null
		| FieldErrorsT[];
}

// ------------------------------------
// Export
export { APIError, HeadlessError, modelErrors };
