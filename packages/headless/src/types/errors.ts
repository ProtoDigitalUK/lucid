import type z from "zod";

export interface HeadlessAPIErrorData {
	type: "validation" | "basic" | "forbidden" | "authorisation";

	name?: string;
	message?: string;
	status?: number;
	code?: "csrf";
	zod?: z.ZodError;
	errorResponse?: ErrorResult;
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
