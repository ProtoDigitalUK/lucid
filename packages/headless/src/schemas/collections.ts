import z from "zod";

export default {
	getAll: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	getSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
	updateSingle: {
		body: z.object({
			title: z.string().optional(),
			singular: z.string().optional(),
			description: z.string().optional().nullable(),
			bricks: z
				.array(
					z.object({
						key: z.string(),
						type: z.enum(["builder", "fixed"]),
						position: z.enum(["top", "bottom", "sidebar"]),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
	createSingle: {
		body: z.object({
			key: z
				.string()
				.min(4)
				.max(128)
				.refine((value) => /^[a-z-]+$/.test(value), {
					message:
						"Invalid key format. Only lowercase letters and dashes are allowed.",
				}),
			type: z.enum(["multiple-builder", "single-builder"]),
			title: z.string(),
			singular: z.string(),
			description: z.string().optional(),
			bricks: z
				.array(
					z.object({
						key: z.string(),
						type: z.enum(["builder", "fixed"]),
						position: z
							.enum(["top", "bottom", "sidebar"])
							.optional(),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
};
