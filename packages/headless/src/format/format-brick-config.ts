export const swaggerBrickConfigsRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		key: {
			type: "string",
		},
		title: {
			type: "string",
		},
		preview: {
			type: "object",
			additionalProperties: true,
			properties: {
				image: {
					type: "string",
				},
			},
		},
		fields: {
			type: "array",
			items: {
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
			},
		},
	},
};
