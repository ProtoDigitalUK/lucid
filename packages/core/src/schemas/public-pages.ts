import z from "zod";

export default {
	getSingle: {
		body: undefined,
		query: z.object({
			filter: z.object({}).optional(),
		}),
		params: z.object({
			slug: z.string(),
		}),
	},
};
