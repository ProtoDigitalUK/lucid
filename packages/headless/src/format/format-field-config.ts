export const swaggerFieldConfigsRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		type: {
			type: "string",
		},
		title: {
			type: "string",
		},
		key: {
			type: "string",
		},
		description: {
			type: "string",
		},
		fields: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: true,
			},
		},
	},
};
