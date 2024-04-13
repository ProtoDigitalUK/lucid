import type z from "zod";
import T from "../translations/index.js";
import headlessLogger from "../libs/logging/index.js";

const DEFAULT_ERROR = {
	name: T("default_error_name"),
	message: T("default_error_message"),
	status: 500,
	code: null,
	errors: null,
};

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

		this.errors = result || null;
	}
}

class HeadlessError extends Error {
	scope?: string;
	kill?: boolean;
	constructor(data: {
		message: string;
		scope?: string;
		kill?: boolean;
	}) {
		super(data.message);
		this.scope = data.scope;
		this.kill = data.kill;

		headlessLogger("error", {
			message: this.message,
			scope: this.scope,
		});

		if (this.kill) process.exit(1);
	}
}

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

export { APIError, HeadlessError, modelErrors };
