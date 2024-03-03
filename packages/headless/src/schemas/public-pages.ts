import z from "zod";

export default {
	getSingle: {
		body: undefined,
		query: z.object({
			filter: z
				.object({
					collection_slug: z.string().optional(),
				})
				.optional(),
		}),
		params: z.object({
			full_slug: z.string(),
		}),
	},
};
