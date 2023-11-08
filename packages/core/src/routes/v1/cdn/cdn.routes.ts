import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
// Utils
import fastifyRoute from "@utils/app/fastify-route.js";
// Controllers
import streamSingle from "@controllers/media/stream-single.js";

const cdnRoutes = async (fastify: FastifyInstance) => {
  // ------------------------------------
  // Stream single media
  fastifyRoute(fastify, {
    method: "get",
    url: "/:key",
    schema: streamSingle.schema,
    controller: streamSingle.controller,
  });
};

export default fp(cdnRoutes);
