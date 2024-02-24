import z from "zod";

export default {
	getSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
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
