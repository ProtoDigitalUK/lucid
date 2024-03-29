import z from "zod";

export const FieldSchemaCollection = z.object({
	key: z.string(),
	type: z.union([
		z.literal("text"),
		z.literal("wysiwyg"),
		z.literal("media"),
		z.literal("number"),
		z.literal("checkbox"),
		z.literal("select"),
		z.literal("textarea"),
		z.literal("json"),
		z.literal("colour"),
		z.literal("datetime"),
		z.literal("pagelink"),
		z.literal("link"),
	]),
	value: z.union([
		z.string(),
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
});
export type FieldCollectionSchemaT = z.infer<typeof FieldSchemaCollection>;

export const FieldSchema = FieldSchemaCollection.extend({
	type: z.union([
		z.literal("text"),
		z.literal("wysiwyg"),
		z.literal("media"),
		z.literal("number"),
		z.literal("checkbox"),
		z.literal("select"),
		z.literal("textarea"),
		z.literal("json"),
		z.literal("colour"),
		z.literal("datetime"),
		z.literal("pagelink"),
		z.literal("link"),
		z.literal("repeater"),
	]),
	group_id: z.union([z.number(), z.string()]).optional(),
});
export type FieldSchemaT = z.infer<typeof FieldSchema>;

export const swaggerFieldObj = {
	type: "object",
	properties: {
		key: {
			type: "string",
		},
		type: {
			type: "string",
		},
		value: {
			type: ["number", "string", "object", "null"],
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
