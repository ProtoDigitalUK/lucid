import z from "zod";

export default {
	createSingle: {
		body: z.object({
			name: z.string().min(2),
			description: z.string().optional(),
		}),
		query: undefined,
		params: undefined,
	},
	getAll: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
};
