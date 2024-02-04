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
			assigned_bricks: z.array(z.string()).optional(),
			assigned_collections: z.array(z.string()).optional(),
			assigned_forms: z.array(z.string()).optional(),
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
				.max(64)
				.refine((value) => /^[a-z-]+$/.test(value), {
					message:
						"Invalid key format. Only lowercase letters and dashes are allowed.",
				}),
			title: z.string(),
			assigned_bricks: z.array(z.string()).optional(),
			assigned_collections: z.array(z.string()).optional(),
			assigned_forms: z.array(z.string()).optional(),
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
