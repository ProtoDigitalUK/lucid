import z from "zod";
import { FieldSchema, swaggerFieldObj } from "./collection-fields.js";
import { GroupSchema, swaggerGroupObj } from "./collection-groups.js";

export const BrickSchema = z.object({
	key: z.string(),
	order: z.number(),
	type: z.union([z.literal("builder"), z.literal("fixed")]),

	groups: z.array(GroupSchema).optional(),
	fields: z.array(FieldSchema).optional(),
});
export interface BrickSchema {
	id?: number | string;
	key?: string;
	order?: number;
	type: "builder" | "fixed" | "collection-fields";
	groups?: z.infer<typeof GroupSchema>[];
	fields?: z.infer<typeof FieldSchema>[];
}

export const swaggerBodyBricksObj = {
	type: "object",
	properties: {
		id: {
			anyOf: [
				{
					type: "number",
				},
				{
					type: "string",
				},
			],
		},
		key: {
			type: "string",
		},
		order: {
			type: "number",
		},
		type: {
			type: "string",
		},
		groups: {
			type: "array",
			items: swaggerGroupObj,
		},
		fields: {
			type: "array",
			items: swaggerFieldObj,
		},
	},
};
