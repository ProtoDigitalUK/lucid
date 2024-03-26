import z from "zod";
import {
	FieldSchema,
	type FieldSchemaT,
	swaggerFieldObj,
} from "./collection-fields.js";
import {
	GroupSchema,
	type GroupSchemaT,
	swaggerGroupObj,
} from "./collection-groups.js";

export const BrickSchema = z.object({
	id: z.union([z.number(), z.string()]).optional(),
	key: z.string(),
	order: z.number(),
	type: z.union([z.literal("builder"), z.literal("fixed")]),

	groups: z.array(GroupSchema).optional(),
	fields: z.array(FieldSchema).optional(),
});
export interface BrickSchemaT {
	id?: number | string;
	key?: string;
	order?: number;
	type: "builder" | "fixed" | "collection-fields";
	groups?: GroupSchemaT[];
	fields?: FieldSchemaT[];
}

export const swaggerBodyBricksObj = {
	type: "object",
	properties: {
		id: {
			type: ["number", "string"],
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
