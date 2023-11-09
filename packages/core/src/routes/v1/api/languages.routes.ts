import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/languages/create-single.js";
import getSingle from "@controllers/languages/get-single.js";
import getMultiple from "@controllers/languages/get-multiple.js";
import updateSingle from "@controllers/languages/update-single.js";
import deleteSingle from "@controllers/languages/delete-single.js";

const languageRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
      paginated: true,
    },
    schema: getMultiple.schema,
    controller: getMultiple.controller,
  });

  r(fastify, {
    method: "post",
    url: "/",
    permissions: {
      global: ["create_language"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: createSingle.schema,
    controller: createSingle.controller,
  });

  r(fastify, {
    method: "get",
    url: "/:code",
    middleware: {
      authenticate: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
  });

  r(fastify, {
    method: "patch",
    url: "/:code",
    permissions: {
      global: ["update_language"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
  });

  r(fastify, {
    method: "delete",
    url: "/:code",
    permissions: {
      global: ["delete_language"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: deleteSingle.schema,
    controller: deleteSingle.controller,
  });
};

export default languageRoutes;
