import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import updateSingle from "@controllers/users/update-single.js";
import createSingle from "@controllers/users/create-single.js";
import deleteSingle from "@controllers/users/delete-single.js";
import getMultiple from "@controllers/users/get-multiple.js";
import getSingle from "@controllers/users/get-single.js";

const userRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "patch",
    url: "/:id",
    permissions: {
      global: ["update_user"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
  });

  r(fastify, {
    method: "post",
    url: "/",
    permissions: {
      global: ["create_user"],
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
      global: ["delete_user"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: deleteSingle.schema,
    controller: deleteSingle.controller,
  });

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
};

export default userRoutes;
