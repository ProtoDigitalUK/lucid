import T from "../../translations/index.js";

const metaObject = {
	type: "object",
	properties: {
		path: { type: "string" },
		links: {
			type: "array",
		},
		current_page: { type: "null" },
		last_page: { type: "null" },
		per_page: { type: "null" },
		total: { type: "null" },
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
					url: { type: ["string", "null"] },
					page: { type: "number" },
				},
			},
		},
		current_page: { type: ["number", "null"] },
		last_page: { type: ["number", "null"] },
		per_page: { type: ["number", "null"] },
		total: { type: ["number", "null"] },
	},
};

const linksObject = {
	type: "object",
	properties: {
		first: { type: ["string", "null"] },
		last: { type: ["string", "null"] },
		next: { type: ["string", "null"] },
		prev: { type: ["string", "null"] },
	},
};

interface SwaggerResponseParamsT {
	type: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;
	data: unknown;
	paginated?: boolean;
}

export const swaggerResponse = (params: SwaggerResponseParamsT) => {
	let description = T("swagger_response_200");

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
		type: "object",
		properties: propertise,
	};
};
