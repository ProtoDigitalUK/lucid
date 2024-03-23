import z from "zod";
import { FieldTypesEnumT } from "../libs/field-builder/index.js";

const FieldTypesSchema = z.nativeEnum(FieldTypesEnumT);

export const FieldSchema = z.object({
	key: z.string(),
	type: FieldTypesSchema,
	value: z.union([
		z.string(),
		z.boolean(),
		z.number(),
		z.object({
			id: z.number().nullable(),
			target: z.string().nullable().optional(),
			label: z.string().nullable().optional(),
		}),
		z.object({
			url: z.string().nullable(),
			target: z.string().nullable().optional(),
			label: z.string().nullable().optional(),
		}),
		z.null(),
		z.any(),
	]),
	language_id: z.number(),
	fields_id: z.number().optional(),
	group_id: z.union([z.number(), z.string()]).optional(),
});
export type FieldObjectT = z.infer<typeof FieldSchema>;

export const GroupSchema = z.object({
	group_id: z.union([z.number(), z.string()]), // if prefixed with ref-, it needs creating - its just a placeholder id to marry up fields that reference it
	group_order: z.number(),
	parent_group_id: z.union([z.number(), z.string(), z.null()]).optional(),
	repeater_key: z.string(),
	language_id: z.number(),
});
export type GroupObjectT = z.infer<typeof GroupSchema>;

export const BrickSchema = z.object({
	id: z.union([z.number(), z.string()]).optional(),
	key: z.string(),
	order: z.number(),
	type: z.union([
		z.literal("builder"),
		z.literal("fixed"),
		z.literal("content"),
	]),

	groups: z.array(GroupSchema).optional(),
	fields: z.array(FieldSchema).optional(),
});
export type BrickObjectT = z.infer<typeof BrickSchema>;

const swaggerFieldObj = {
	type: "object",
	properties: {
		key: {
			type: "string",
		},
		type: {
			type: "string",
		},
		value: {
			type: ["number", "string", "boolean", "object", "null"],
			nullable: true,
		},
		language_id: {
			type: "number",
		},
		fields_id: {
			type: "number",
		},
		group_id: {
			type: ["number", "string"],
			nullable: true,
		},
	},
};
const swaggerGroupObj = {
	type: "object",
	properties: {
		group_id: {
			type: ["number", "string"],
		},
		group_order: {
			type: "number",
		},
		parent_group_id: {
			type: ["number", "string"],
			nullable: true,
		},
		repeater_key: {
			type: "string",
		},
		language_id: {
			type: "number",
		},
	},
};

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
