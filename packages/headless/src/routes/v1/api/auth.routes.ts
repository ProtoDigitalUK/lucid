import { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
	fastify.get(
		"/me",
		{
			schema: {
				description: "Returns user data based on the authenticated user",
				tags: ["user"],
				summary: "Returns user data based on the authenticated user",
				response: {
					200: {
						description: "Successful response",
						type: "object",
						properties: {
							first_name: { type: "string" },
							last_name: { type: "string" },
						},
					},
				},
			},
		},
		(req, reply) => {},
	);
};

export default authRoutes;
