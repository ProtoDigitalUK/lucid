import z from "zod";

export default {
	getSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
	getAll: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
};
