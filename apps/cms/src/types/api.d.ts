export interface APIResponse<Data> {
	data: Data;
	meta: {
		path: string;
		links: Array<unknown>;
		current_page: number | null;
		per_page: number | null;
		total: number | null;
		last_page: number | null;
	};
}

export interface APIErrorResponse {
	status: number;
	name: string;
	message: string;
	errors: ErrorResult;
}

export interface FieldError {
	brick_id: string | number | undefined;
	group_id: string | number | undefined;
	key: string;
	language_id: number;
	message: string;
}

export interface ErrorResult {
	// @ts-ignore
	code?: string;
	// @ts-ignore
	message?: string;
	// @ts-ignore
	children?: Array<undefined | ErrorResult>;
	// @ts-ignore
	fields?: Array<FieldError>;
	[key: string]: ErrorResult;
}
