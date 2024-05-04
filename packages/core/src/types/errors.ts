import type z from "zod";

export interface LucidAPIErrorData {
	type: "validation" | "basic" | "forbidden" | "authorisation";

	name?: string;
	message?: string;
	status?: number;
	code?: "csrf";
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
	languageId?: number;
	message: string;
}
