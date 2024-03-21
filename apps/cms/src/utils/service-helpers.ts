import type { Accessor } from "solid-js";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import helpers from "@/utils/helpers";
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Types
import type { APIErrorResponse } from "@/types/api";
import type { QueryBuilderProps } from "@/utils/query-builder";

type QueryParamsValueT = Accessor<unknown> | unknown;

interface QueryParams {
	queryString?: Accessor<string> | string;
	filters?: Record<string, QueryParamsValueT>;
	location?: Record<string, QueryParamsValueT>;
	headers?: Record<string, QueryParamsValueT>;
	include?: Record<string, QueryParamsValueT>;
	perPage?: Accessor<number> | number;
}

interface MutationWrapperProps<Params, Response> {
	mutationFn: (_params: Params) => Promise<Response>;
	successToast?: { title: string; message: string };
	errorToast?: { title: string; message: string };
	invalidates?: string[];
	onSuccess?: (_data: Response) => void;
	onError?: (_errors: APIErrorResponse | undefined) => void;
}

// -------------------------------------------------
// Get Service Helpers

// Resolve all values in an object
const resolveObject = (obj?: Record<string, QueryParamsValueT>) => {
	if (!obj) return obj;

	const result: Record<string, QueryParamsValueT> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = helpers.resolveValue(obj[key]);
		}
	}
	return result;
};

// Get query params
const getQueryParams = <T extends QueryParams>(params: T) => {
	const { queryString, filters, location, headers, include, perPage } =
		params;

	return {
		queryString: helpers.resolveValue(queryString) as string,
		filters: resolveObject(filters) as QueryBuilderProps["filters"],
		location: resolveObject(location),
		headers: resolveObject(headers) as Record<string, string>,
		include: resolveObject(include) as Record<string, boolean>,
		perPage: helpers.resolveValue(perPage) as number,
	};
};

// Get query key
const getQueryKey = (params: ReturnType<typeof getQueryParams>) => {
	return JSON.stringify(params);
};

// -------------------------------------------------
// Mutation Service Helpers

// Mutation wrapper
const useMutationWrapper = <Params, Response>({
	mutationFn,
	successToast,
	errorToast,
	invalidates = [],
	onSuccess,
	onError,
}: MutationWrapperProps<Params, Response>) => {
	const [errors, setErrors] = createSignal<APIErrorResponse>();
	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		mutationFn,
		onSettled: (data, error) => {
			if (data) {
				if (successToast) {
					spawnToast({
						title: successToast.title,
						message: successToast.message,
						status: "success",
					});
				}
				setErrors(undefined);
				if (onSuccess) onSuccess(data);
				for (const query of invalidates) {
					queryClient.invalidateQueries({
						queryKey: [query],
					});
				}
			} else if (error) {
				if (errorToast) {
					spawnToast({
						title: errorToast.title || "Error",
						message: errorToast.message || "An error occurred",
						status: "error",
					});
				}
				const errors = validateSetError(error);
				setErrors(errors);
				onError?.(errors);
			}
		},
	}));

	onCleanup(() => {
		setErrors(undefined);
	});

	return {
		action: mutation,
		errors: errors,
		reset: () => {
			setErrors(undefined);
			mutation.reset();
		},
	};
};

// -------------------------------------------------
// Export
const serviceHelpers = {
	getQueryParams,
	getQueryKey,
	useMutationWrapper,
};

export default serviceHelpers;
