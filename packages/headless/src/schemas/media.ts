import z from "zod";

export default {
	uploadSingle: {
		body: z.object({
			translations: z
				.array(
					z.object({
						language_id: z.number(),
						value: z.string().nullable(),
						key: z.enum(["title", "alt"]),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
};
