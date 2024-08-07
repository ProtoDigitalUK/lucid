import type z from "zod";

export interface LucidErrorData {
	type?:
		| "validation"
		| "basic"
		| "forbidden"
		| "authorisation"
		| "cron"
		| "toolkit";

	name?: string;
	message?: string;
	status?: number;
	code?: "csrf" | "login" | "authorisation" | "rate_limit" | "not_found";
	zod?: z.ZodError;
	errorResponse?: ErrorResult;
}

export type ErrorResultValue =
	| ErrorResultObj
	| ErrorResultObj[]
	| FieldErrors[]
	| string
	| undefined;

export interface ErrorResultObj {
	code?: string;
	message?: string;
	children?: ErrorResultObj[];
	[key: string]: ErrorResultValue;
}

export type ErrorResult = Record<string, ErrorResultValue>;

export interface FieldErrors {
	brickId: string | number | undefined;
	groupId: string | number | undefined;
	key: string;
	localeCode?: string;
	message: string;
}
