import z from "zod";

export const GroupSchema = z.object({
	groupId: z.union([z.number(), z.string()]), // if prefixed with ref-, it needs creating - its just a placeholder id to marry up fields that reference it
	groupOrder: z.number(),
	parentGroupId: z.union([z.number(), z.string(), z.null()]).optional(),
	repeaterKey: z.string(),
});

export type GroupSchemaType = z.infer<typeof GroupSchema>;

export const swaggerGroupObj = {
	type: "object",
	properties: {
		groupId: {
			anyOf: [
				{
					type: "number",
				},
				{
					type: "string",
				},
			],
		},
		groupOrder: {
			type: "number",
		},
		parentGroupId: {
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
		repeaterKey: {
			type: "string",
		},
	},
};
