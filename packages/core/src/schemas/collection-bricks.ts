import z from "zod";
import { FieldSchema, swaggerFieldObj } from "./collection-fields.js";

export const BrickSchema = z.object({
	key: z.string(),
	order: z.number(),
	type: z.union([z.literal("builder"), z.literal("fixed")]),

	fields: z.array(FieldSchema).optional(),
});
export interface BrickSchema {
	id?: number | string;
	key?: string;
	order?: number;
	type: "builder" | "fixed" | "collection-fields";
	fields?: z.infer<typeof FieldSchema>[];
}

export const swaggerBodyBricksObj = {
	type: "object",
	properties: {
		key: {
			type: "string",
		},
		order: {
			type: "number",
		},
		type: {
			type: "string",
		},
		fields: {
			type: "array",
			items: swaggerFieldObj,
		},
	},
};
