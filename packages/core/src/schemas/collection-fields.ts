import z from "zod";

export const FieldBaseSchema = z.object({
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
		z.literal("link"),
		z.literal("repeater"),
		z.literal("user"),
	]),
	value: z
		.union([
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
		])
		.optional(),
	languageId: z.number(),
});

export const FieldSchema: z.ZodType<FieldSchemaType> = FieldBaseSchema.extend({
	groups: z
		.lazy(() =>
			z.array(
				z.object({
					id: z.union([z.string(), z.number()]),
					fields: z.array(FieldSchema),
				}),
			),
		)
		.optional(),
});

export type FieldSchemaType = z.infer<typeof FieldBaseSchema> & {
	groups?: {
		id: string | number;
		fields: FieldSchemaType[];
	}[];
};
export type FieldSchemaSimpleType = z.infer<typeof FieldBaseSchema> & {
	groups?: FieldSchemaType[][];
};

export const swaggerFieldObj = {
	type: "object",
	additionalProperties: true,
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
			nullable: true,
		},
		groups: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: true,
				properties: {
					id: {
						anyOf: [
							{
								type: "string",
							},
							{
								type: "number",
							},
						],
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
