import z from "zod";

export default {
	uploadSingle: {
		body: z.object({
			translations: z
				.array(
					z.object({
						language_id: z.number(),
						title: z.string().optional(),
						alt: z.string().optional(),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
};
