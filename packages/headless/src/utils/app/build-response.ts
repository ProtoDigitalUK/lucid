import { FastifyRequest } from "fastify";
// Services
import getConfig from "../../services/config.js";

// --------------------------------------------------
// Types
interface BuildResponseParams {
	data: unknown;
	pagination?: {
		count: number;
		page: string;
		per_page: string;
	};
}

type BuildResponseT = (
	request: FastifyRequest,
	params: BuildResponseParams,
) => Promise<ResponseBodyT>;

// --------------------------------------------------
// Helpers

const getPath = async (request: FastifyRequest) => {
	const config = await getConfig();

	const originalUrl = request.originalUrl;
	return `${config.host}${originalUrl}`.split("?")[0];
};

const buildMetaLinks = (
	request: FastifyRequest,
	params: BuildResponseParams,
): ResponseBodyT["meta"]["links"] => {
	const links: ResponseBodyT["meta"]["links"] = [];
	if (!params.pagination) return links;

	const { page, per_page, count } = params.pagination;
	const totalPages = Math.ceil(count / Number(per_page));

	const url = new URL(
		`${request.protocol}://${request.hostname}${request.originalUrl}`,
	);

	for (let i = 0; i < totalPages; i++) {
		if (i !== 0) url.searchParams.set("page", String(i + 1));
		else url.searchParams.delete("page");
		links.push({
			active: page === String(i + 1),
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
): ResponseBodyT["links"] => {
	if (!params.pagination) return undefined;

	const { page, per_page, count } = params.pagination;
	const totalPages = Math.ceil(count / Number(per_page));

	const url = new URL(
		`${request.protocol}://${request.hostname}${request.originalUrl}`,
	);

	const links: ResponseBodyT["links"] = {
		first: null,
		last: null,
		next: null,
		prev: null,
	};

	// Set First
	url.searchParams.delete("page");
	links.first = url.toString();

	// Set Last
	if (page !== String(totalPages))
		url.searchParams.set("page", String(totalPages));
	links.last = url.toString();

	// Set Next
	if (page !== String(totalPages)) {
		url.searchParams.set("page", String(Number(page) + 1));
		links.next = url.toString();
	} else {
		links.next = null;
	}

	// Set Prev
	if (page !== "1") {
		url.searchParams.set("page", String(Number(page) - 1));
		links.prev = url.toString();
	} else {
		links.prev = null;
	}

	return links;
};

// --------------------------------------------------
// Main
const buildResponse: BuildResponseT = async (request, params) => {
	const meta = {
		path: await getPath(request),
		links: buildMetaLinks(request, params),
		current_page: Number(params.pagination?.page) || null,
		per_page: Number(params.pagination?.per_page) || null,
		total: Number(params.pagination?.count) || null,
		last_page: params.pagination
			? Math.ceil(
					params.pagination?.count /
						Number(params.pagination.per_page),
			  ) ||
			  Number(params.pagination?.page) ||
			  null
			: null,
	};
	const links = buildLinks(request, params);

	return {
		data: params.data || null,
		meta: meta,
		links,
	};
};

export default buildResponse;
