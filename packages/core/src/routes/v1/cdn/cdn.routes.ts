import { FastifyInstance } from "fastify";
// Utils
import r from "@utils/app/route.js";
// Controllers
import streamSingle from "@controllers/media/stream-single.js";

const cdnRoutes = async (fastify: FastifyInstance) => {
  // ------------------------------------
  // Stream single media
  r(fastify, {
    method: "get",
    url: "/:key",
    schema: streamSingle.schema,
    controller: streamSingle.controller,
  });
};

export default cdnRoutes;
