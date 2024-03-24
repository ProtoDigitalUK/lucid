import { swaggerFieldConfigsRes } from "./format-field-config.js";

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
			items: swaggerFieldConfigsRes,
		},
	},
};
