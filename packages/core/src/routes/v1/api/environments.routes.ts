import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getAll from "@controllers/environments/get-all.js";
import getSingle from "@controllers/environments/get-single.js";
import updateSingle from "@controllers/environments/update-single.js";
import createSingle from "@controllers/environments/create-single.js";
import deleteSingle from "@controllers/environments/delete-single.js";
import migrateEnvrionment from "@controllers/environments/migrate-envrionment.js";

const environmentRoutes = async (fastify: FastifyInstance) => {
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
    method: "delete",
    url: "/:key",
    permissions: {
      global: ["delete_environment"],
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
    url: "/:key",
    middleware: {
      authenticate: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
  });

  r(fastify, {
    method: "patch",
    url: "/:key",
    permissions: {
      global: ["update_environment"],
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
      global: ["create_environment"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: createSingle.schema,
    controller: createSingle.controller,
  });

  r(fastify, {
    method: "post",
    url: "/:key/migrate",
    permissions: {
      global: ["migrate_environment"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: migrateEnvrionment.schema,
    controller: migrateEnvrionment.controller,
  });
};

export default environmentRoutes;
