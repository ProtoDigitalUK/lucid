import type z from "zod";

export enum HeadlessAPIErrorTypes {
	Basic = "basic",
	Validation = "validation",
	Forbidden = "forbidden",
	Authorisation = "authorisation",
}

export enum HeadlessAPIErrorCodes {
	CSRF = "csrf",
}

export interface HeadlessAPIErrorData {
	type: HeadlessAPIErrorTypes;

	name?: string;
	message?: string;
	status?: number;
	code?: HeadlessAPIErrorCodes;
	zod?: z.ZodError;
	errors?: ErrorResult;
}

export interface ErrorResult {
	code?: string;
	message?: string;
	children?: Array<undefined | ErrorResult | null>;

	[key: string]:
		| Array<undefined | ErrorResult | null>
		| string
		| undefined
		| ErrorResult
		| null
		| FieldErrors[];
}

export interface FieldErrors {
	brick_id: string | number | undefined;
	group_id: string | number | undefined;
	key: string;
	language_id: number;
	message: string;
}
