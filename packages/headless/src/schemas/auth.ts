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
};
