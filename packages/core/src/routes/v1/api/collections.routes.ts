import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getAll from "@controllers/collections/get-all.js";
import getSingle from "@controllers/collections/get-single.js";

const collectionRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
    },
    schema: getAll.schema,
    controller: getAll.controller,
  });

  r(fastify, {
    method: "get",
    url: "/:collection_key",
    middleware: {
      authenticate: true,
      validateEnvironment: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
  });
};

export default collectionRoutes;
