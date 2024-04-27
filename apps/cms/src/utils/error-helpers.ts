import type { Accessor } from "solid-js";
import type { ErrorResponse, ErrorResultObj } from "@protoheadless/core/types";

export const getBodyError = (
	key: string,
	errors: Accessor<ErrorResponse | undefined>,
) => {
	if (!errors()) {
		return undefined;
	}

	// @ts-expect-error
	return errors()?.errors?.body[key] as ErrorResultObj | undefined;
};
