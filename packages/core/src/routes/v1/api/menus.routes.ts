import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/menu/create-single.js";
import deleteSingle from "@controllers/menu/delete-single.js";
import getSingle from "@controllers/menu/get-single.js";
import getMultiple from "@controllers/menu/get-multiple.js";
import updateSingle from "@controllers/menu/update-single.js";

const menuRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "post",
    url: "/",
    permissions: {
      environments: ["create_menu"],
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
    method: "delete",
    url: "/:id",
    permissions: {
      environments: ["delete_menu"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: deleteSingle.schema,
    controller: deleteSingle.controller,
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
    method: "patch",
    url: "/:id",
    permissions: {
      environments: ["update_menu"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
  });
};

export default menuRoutes;
