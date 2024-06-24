import T from "../../../translations/index.js";
import type { LucidErrorData } from "../../../types/errors.js";

const mergeServiceError = (
	error: LucidErrorData,
	defaultError?: Omit<Partial<LucidErrorData>, "zod" | "errorResponse">,
): LucidErrorData => {
	return {
		type: error.type ?? defaultError?.type ?? "basic",
		name: error.name ?? defaultError?.name ?? T("unknown_service_error"),
		message:
			error.message ??
			defaultError?.message ??
			T("unknown_service_error_message"),
		status: error.status ?? defaultError?.status ?? 500,
		code: error.code ?? defaultError?.code ?? undefined,
		zod: error.zod ?? undefined,
		errorResponse: error.errorResponse ?? undefined,
	};
};

export default mergeServiceError;
