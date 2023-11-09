import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getMultiple from "@controllers/categories/get-multiple.js";
import createSingle from "@controllers/categories/create-single.js";
import updateSingle from "@controllers/categories/update-single.js";
import deleteSingle from "@controllers/categories/delete-single.js";
import getSingle from "@controllers/categories/get-single.js";

const categoryRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
      paginated: true,
      validateEnvironment: true,
    },
    schema: getMultiple.schema,
    controller: getMultiple.controller,
  });

  r(fastify, {
    method: "get",
    url: "/:id",
    middleware: {
      authenticate: true,
      validateEnvironment: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
  });

  r(fastify, {
    method: "post",
    url: "/",
    permissions: {
      environments: ["create_category"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: createSingle.schema,
    controller: createSingle.controller,
  });

  r(fastify, {
    method: "patch",
    url: "/:id",
    permissions: {
      environments: ["update_category"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
  });

  r(fastify, {
    method: "delete",
    url: "/:id",
    permissions: {
      environments: ["delete_category"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: deleteSingle.schema,
    controller: deleteSingle.controller,
  });
};

export default categoryRoutes;
