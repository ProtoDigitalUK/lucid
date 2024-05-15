import z from "zod";

export default {
	getSingle: {
		query: undefined,
		params: z.object({
			code: z.string().min(2),
		}),
		body: undefined,
	},
	getAll: {
		query: undefined,
		params: undefined,
		body: undefined,
	},
};
