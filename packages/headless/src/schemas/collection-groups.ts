import z from "zod";

export const GroupSchema = z.object({
	group_id: z.union([z.number(), z.string()]), // if prefixed with ref-, it needs creating - its just a placeholder id to marry up fields that reference it
	group_order: z.number(),
	parent_group_id: z.union([z.number(), z.string(), z.null()]).optional(),
	repeater_key: z.string(),
	language_id: z.number(),
});
export type GroupSchemaT = z.infer<typeof GroupSchema>;

export const swaggerGroupObj = {
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
