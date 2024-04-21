import z from "zod";

export const FieldSchema = z.object({
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
		// z.literal("repeater"), // is this needed?
		z.literal("user"),
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
	languageId: z.number(),
	groupId: z.union([z.number(), z.string()]).optional(),
});

export type FieldSchemaType = z.infer<typeof FieldSchema>;

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
			anyOf: [
				{
					type: "number",
					nullable: true,
				},
				{
					type: "string",
					nullable: true,
				},
				{
					type: "object",
					additionalProperties: true,
					nullable: true,
				},
				{
					type: "null",
				},
			],
		},
		languageId: {
			type: "number",
		},
		groupId: {
			anyOf: [
				{
					type: "number",
					nullable: true,
				},
				{
					type: "string",
					nullable: true,
				},
				{
					type: "null",
				},
			],
		},
	},
};
