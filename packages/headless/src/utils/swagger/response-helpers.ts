import T from "../../translations/index.js";
import constants from "../../constants.js";

const metaObject = {
	type: "object",
	properties: {
		path: { type: "string" },
		links: {
			type: "array",
		},
		current_page: { type: "number", nullable: true, example: null },
		last_page: { type: "number", nullable: true, example: null },
		per_page: { type: "number", nullable: true, example: null },
		total: { type: "number", nullable: true, example: null },
	},
};

const paginatedMetaObject = {
	type: "object",
	properties: {
		path: { type: "string" },
		links: {
			type: "array",
			items: {
				type: "object",
				properties: {
					active: { type: "boolean" },
					label: { type: "string" },
					url: { type: "string", nullable: true },
					page: { type: "number" },
				},
			},
		},
		current_page: {
			type: "number",
			nullable: true,
			example: constants.query.page,
		},
		last_page: {
			type: "number",
			nullable: true,
			example: 200 / constants.query.per_page,
		},
		per_page: {
			type: "number",
			nullable: true,
			example: constants.query.per_page,
		},
		total: { type: "number", nullable: true, example: 200 },
	},
};

const linksObject = {
	type: "object",
	properties: {
		first: { type: "string", nullable: true },
		last: { type: "string", nullable: true },
		next: { type: "string", nullable: true },
		prev: { type: "string", nullable: true },
	},
};

interface SwaggerResponseParamsT {
	type: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;
	data?: unknown;
	paginated?: boolean;
	noPropertise?: boolean;
}

export const swaggerResponse = (params: SwaggerResponseParamsT) => {
	let description = T("swagger_response_200");
	const headers: {
		_access?: unknown;
		_refresh?: unknown;
		_csrf?: unknown;
	} = {};

	switch (params.type) {
		case 200:
			description = T("swagger_response_200");
			break;
		case 201:
			description = T("swagger_response_201");
			break;
		case 204:
			description = T("swagger_response_204");
			break;
		case 400:
			description = T("swagger_response_400");
			break;
		case 401:
			description = T("swagger_response_401");
			break;
		case 403:
			description = T("swagger_response_403");
			break;
		case 404:
			description = T("swagger_response_404");
			break;
		case 500:
			description = T("swagger_response_500");
			break;
	}

	const propertise: {
		data: unknown;
		meta: unknown;
		links?: unknown;
	} = {
		data: params.data,
		meta: params.paginated ? paginatedMetaObject : metaObject,
	};

	if (params.paginated) {
		propertise.links = linksObject;
	}

	return {
		description: description,
		type: params.noPropertise === true ? "null" : "object",
		properties: params.noPropertise === true ? undefined : propertise,
		headers: headers,
	};
};

interface SwaggerHeadersT {
	// undefine means dont include in the schema, boolean means required or not
	csrf?: boolean;
	contentLanguage?: boolean;
}

export const swaggerHeaders = (headers: SwaggerHeadersT) => {
	const propertise: {
		_csrf?: {
			type: string;
			description: string;
		};
		"headless-content-lang"?: {
			type: string;
			description: string;
		};
	} = {};
	const required: string[] = [];

	if (headers.csrf !== undefined) {
		propertise._csrf = {
			type: "string",
			description: T("swagger_csrf_header_description"),
		};
		if (headers.csrf) {
			required.push("_csrf");
		}
	}

	if (headers.contentLanguage !== undefined) {
		propertise["headless-content-lang"] = {
			type: "string",
			description: T("swagger_content_language_header_description"),
		};
	}

	return {
		type: "object",
		properties: propertise,
		required: required,
	};
};
