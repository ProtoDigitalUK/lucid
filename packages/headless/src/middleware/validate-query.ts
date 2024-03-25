import T from "../translations/index.js";
import type { FastifyRequest } from "fastify";
import z, { type ZodTypeAny } from "zod";
import constants from "../constants.js";
import { APIError } from "../utils/error-handler.js";

export interface RequestQueryParsedT {
	filter: Record<string, string | Array<string>> | undefined;
	sort:
		| Array<{
				key: string;
				value: "asc" | "desc";
		  }>
		| undefined;
	include: Array<string> | undefined;
	exclude: Array<string> | undefined;
	page: number;
	per_page: number;
}

const buildSort = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const sort = queryObject.sort;
	if (!sort) return undefined;

	return sort.split(",").map((sort) => {
		if (sort.startsWith("-")) {
			return {
				key: sort.slice(1),
				value: "desc",
			};
		}

		return {
			key: sort,
			value: "asc",
		};
	});
};

const buildFilter = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const result: RequestQueryParsedT["filter"] = {};

	for (const [key, value] of Object.entries(queryObject)) {
		if (key.includes("filter[")) {
			const name = key.split("[")[1].split("]")[0];
			if (value.includes(",")) {
				result[name] = value.split(",");
			} else if (value !== "") {
				result[name] = value;
			}
		}
	}

	return Object.keys(result).length === 0 ? undefined : result;
};

const buildCollectionFilter = (filters: Record<string, string | string[]>) => {
	// format c_f filter
	// value looks like: page_title=hello,page_title=world,page_excerpt=lorem,example=

	// TODO: move to of buildCFFilter function. Values should exist seperate to this filter object so there arent name conflicts
	// TODO: between collection filter keys and normal filter keys
	if (filters.c_f !== undefined) {
		// split the value by comma
		const splitValue = Array.isArray(result.c_f)
			? result.c_f
			: [result.c_f];

		// create a new object to store the filter
		const filter: Record<string, string[]> = {};
		// loop through the split value
		for (const value of splitValue) {
			// split the value by the equal sign
			const [key, val] = value.split("=");
			// if the key is not in the object, create an array
			if (filter[key] === undefined) {
				filter[key] = [];
			}
			// if the value is not empty, push it to the array
			if (val !== "") {
				filter[key].push(val);
			}
		}
	}
};

const buildPage = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const page = queryObject.page;
	if (!page) return constants.query.page;

	return Number.parseInt(page);
};

const buildPerPage = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const perPage = queryObject.per_page;
	if (!perPage) return constants.query.per_page;

	return Number.parseInt(perPage);
};

const buildInclude = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const include = queryObject.include;
	if (!include) return undefined;

	return include.split(",");
};

const buildExclude = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const exclude = queryObject.exclude;
	if (!exclude) return undefined;

	return exclude.split(",");
};
const addRemainingQuery = (query: unknown) => {
	const queryObject = query as Record<string, string>;
	const remainingQuery = Object.fromEntries(
		Object.entries(queryObject).filter(
			([key]) =>
				![
					"include",
					"exclude",
					"filter",
					"sort",
					"page",
					"per_page",
				].includes(key),
		),
	);
	return remainingQuery;
};

const validateQuery =
	(schema: ZodTypeAny) => async (request: FastifyRequest) => {
		const querySchema = z.object({
			query: schema ?? z.object({}),
		});

		const validateResult = await querySchema.safeParseAsync({
			query: {
				sort: buildSort(request.query),
				filter: buildFilter(request.query),
				include: buildInclude(request.query),
				exclude: buildExclude(request.query),
				page: buildPage(request.query),
				per_page: buildPerPage(request.query),
				...addRemainingQuery(request.query),
			},
		});

		if (!validateResult.success) {
			throw new APIError({
				type: "validation",
				message: T("validation_query_error_message"),
				zod: validateResult.error,
			});
		}

		request.query = validateResult.data.query;
	};

export default validateQuery;
