import type { FastifyInstance } from "fastify";
// API
import clientDocumentsRoutes from "./documents.routes.js";

const clientRoutes = async (fastify: FastifyInstance) => {
	fastify.register(clientDocumentsRoutes);
};

export default clientRoutes;
