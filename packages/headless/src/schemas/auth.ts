import z from "zod";

export default {
	getAuthenticatedUser: {
		body: z.object({}),
		query: z.object({}),
		params: z.object({}),
	},
	getCSRF: {
		body: z.object({}),
		query: z.object({}),
		params: z.object({}),
	},
	login: {
		body: z.object({
			usernameOrEmail: z.string(),
			password: z.string(),
		}),
		query: z.object({}),
		params: z.object({}),
	},
};
