import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import updateSingle from "@controllers/single-pages/update-single.js";
import getSingle from "@controllers/single-pages/get-single.js";

const singlePageRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "patch",
    url: "/:collection_key",
    permissions: {
      environments: ["update_content"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
      contentLanguage: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
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

export default singlePageRoutes;
