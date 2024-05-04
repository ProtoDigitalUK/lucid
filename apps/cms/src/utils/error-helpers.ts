import type { Accessor } from "solid-js";
import type {
	ErrorResponse,
	ErrorResultObj,
	ErrorResultValue,
} from "@lucidcms/core/types";

export const getBodyError = (
	key: string,
	errors: Accessor<ErrorResponse | undefined>,
) => {
	if (!errors()) {
		return undefined;
	}

	// @ts-expect-error-base
	return errors()?.errors?.body[key] as ErrorResultObj | undefined;
};

export const getErrorObject = (
	error: ErrorResultValue,
): ErrorResultObj | undefined => {
	if (error === undefined) return undefined;
	if (typeof error === "string") return undefined;
	if (Array.isArray(error)) return undefined;

	return error;
};
