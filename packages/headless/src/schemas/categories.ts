import z from "zod";

export default {
	createSingle: {
		body: z.object({
			collection_key: z.string(),
			slug: z.string(),
			title: z.array(
				z.object({
					language_id: z.number(),
					value: z.string().nullable(),
				}),
			),
			description: z
				.array(
					z.object({
						language_id: z.number(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
	getSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
};
