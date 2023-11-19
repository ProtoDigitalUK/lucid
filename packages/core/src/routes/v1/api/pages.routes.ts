import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/pages/create-single.js";
import getMultiple from "@controllers/pages/get-multiple.js";
import getSingle from "@controllers/pages/get-single.js";
import updateSingle from "@controllers/pages/update-single.js";
import deleteSingle from "@controllers/pages/delete-single.js";
import deleteMultiple from "@controllers/pages/delete-multiple.js";
import getMultipleValidParents from "@controllers/pages/get-multiple-valid-parents.js";
import updateSingleBricksController from "@controllers/pages/update-single-bricks.js";

const pageRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/:id/valid-parents",
    middleware: {
      authenticate: true,
      validateEnvironment: true,
      paginated: true,
      contentLanguage: true,
    },
    schema: getMultipleValidParents.schema,
    controller: getMultipleValidParents.controller,
  });

  r(fastify, {
    method: "post",
    url: "/",
    permissions: {
      environments: ["create_content"],
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
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
      paginated: true,
      validateEnvironment: true,
      contentLanguage: true,
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
    method: "patch",
    url: "/:id",
    permissions: {
      environments: ["update_content"],
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
    method: "patch",
    url: "/:collection_key/:id/bricks",
    permissions: {
      environments: ["update_content"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: updateSingleBricksController.schema,
    controller: updateSingleBricksController.controller,
  });

  r(fastify, {
    method: "delete",
    url: "/:id",
    permissions: {
      environments: ["delete_content"],
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
    method: "delete",
    url: "/",
    permissions: {
      environments: ["delete_content"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
      validateEnvironment: true,
    },
    schema: deleteMultiple.schema,
    controller: deleteMultiple.controller,
  });
};

export default pageRoutes;
