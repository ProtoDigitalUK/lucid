import type { FastifyRequest } from "fastify";
import type { ResponseBody } from "../types/response.js";
// Services
import getConfig from "../libs/config/get-config.js";

// --------------------------------------------------
// Types
interface BuildResponseParams {
	data: unknown;
	pagination?: {
		count: number;
		page: number;
		perPage: number;
	};
}

type BuildResponse = (
	request: FastifyRequest,
	params: BuildResponseParams,
) => Promise<ResponseBody>;

// --------------------------------------------------
// Helpers

const getPath = async (request: FastifyRequest) => {
	const config = await getConfig();

	const originalUrl = request.originalUrl;
	return `${config.host}${originalUrl}`.split("?")[0] ?? "";
};

const buildMetaLinks = (
	request: FastifyRequest,
	params: BuildResponseParams,
): ResponseBody["meta"]["links"] => {
	const links: ResponseBody["meta"]["links"] = [];
	if (!params.pagination) return links;

	const { page, perPage, count } = params.pagination;
	const totalPages = Math.ceil(count / Number(perPage));

	const url = new URL(
		`${request.protocol}://${request.hostname}${request.originalUrl}`,
	);

	for (let i = 0; i < totalPages; i++) {
		if (i !== 0) url.searchParams.set("page", String(i + 1));
		else url.searchParams.delete("page");
		links.push({
			active: page === i + 1,
			label: String(i + 1),
			url: url.toString(),
			page: i + 1,
		});
	}

	return links;
};
const buildLinks = (
	request: FastifyRequest,
	params: BuildResponseParams,
): ResponseBody["links"] => {
	if (!params.pagination) return undefined;

	const { page, perPage, count } = params.pagination;
	const totalPages = perPage === -1 ? 1 : Math.ceil(count / Number(perPage));

	const url = new URL(
		`${request.protocol}://${request.hostname}${request.originalUrl}`,
	);

	const links: ResponseBody["links"] = {
		first: null,
		last: null,
		next: null,
		prev: null,
	};

	// Set First
	url.searchParams.delete("page");
	links.first = url.toString();

	// Set Last
	if (page !== totalPages) url.searchParams.set("page", String(totalPages));
	links.last = url.toString();

	// Set Next
	if (page !== totalPages) {
		url.searchParams.set("page", String(Number(page) + 1));
		links.next = url.toString();
	} else {
		links.next = null;
	}

	// Set Prev
	if (page !== 1) {
		url.searchParams.set("page", String(Number(page) - 1));
		links.prev = url.toString();
	} else {
		links.prev = null;
	}

	return links;
};

// --------------------------------------------------
// Main
const buildResponse: BuildResponse = async (request, params) => {
	let lastPage = null;
	if (params.pagination) {
		if (params.pagination.perPage === -1) {
			lastPage = 1;
		} else {
			lastPage = Math.ceil(
				params.pagination.count / Number(params.pagination.perPage),
			);
		}
	}

	const meta: ResponseBody["meta"] = {
		path: await getPath(request),
		links: buildMetaLinks(request, params),
		currentPage: params.pagination?.page ?? null,
		perPage: params.pagination?.perPage ?? null,
		total: Number(params.pagination?.count) || null,
		lastPage: lastPage,
	};
	const links = buildLinks(request, params);

	return {
		data: params.data || null,
		meta: meta,
		links,
	};
};

export default buildResponse;
