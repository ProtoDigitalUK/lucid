import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/roles/create-single.js";
import deleteSingle from "@controllers/roles/delete-single.js";
import updateSingle from "@controllers/roles/update-single.js";
import getMultiple from "@controllers/roles/get-multiple.js";
import getSingle from "@controllers/roles/get-single.js";

const roleRoutes = async (fastify: FastifyInstance) => {
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
    method: "get",
    url: "/:id",
    middleware: {
      authenticate: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
  });

  r(fastify, {
    method: "post",
    url: "/",
    permissions: {
      global: ["create_role"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: createSingle.schema,
    controller: createSingle.controller,
  });

  r(fastify, {
    method: "delete",
    url: "/:id",
    permissions: {
      global: ["delete_role"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: deleteSingle.schema,
    controller: deleteSingle.controller,
  });

  r(fastify, {
    method: "patch",
    url: "/:id",
    permissions: {
      global: ["update_role"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
  });
};

export default roleRoutes;
