import z from "zod";

const BrickConfigSchema = z.object({
	title: z.union([z.string(), z.record(z.string(), z.string())]),
	description: z
		.union([z.string(), z.record(z.string(), z.string())])
		.optional(),
	preview: z
		.object({
			image: z.string().optional(),
		})
		.optional(),
});

export default BrickConfigSchema;
