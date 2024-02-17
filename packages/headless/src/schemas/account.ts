import z from "zod";

export default {
	getMe: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	updateMe: {
		body: z.object({
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			username: z.string().min(3).optional(),
			email: z.string().email().optional(),
			role_ids: z.array(z.number()).optional(),
		}),
		query: undefined,
		params: undefined,
	},
};
