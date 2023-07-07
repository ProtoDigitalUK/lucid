import { Router } from "express";
import r from "@utils/route";
// Controller
import getAll from "@controllers/environments/get-all";
import getSingle from "@controllers/environments/get-single";
import updateSingle from "@controllers/environments/update-single";
import createSingle from "@controllers/environments/create-single";
import deleteSingle from "@controllers/environments/delete-single";
import migrateEnvrionment from "@controllers/environments/migrate-envrionment";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: getAll.schema,
  controller: getAll.controller,
});

r(router, {
  method: "delete",
  path: "/:key",
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

r(router, {
  method: "get",
  path: "/:key",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

r(router, {
  method: "patch",
  path: "/:key",
  permissions: {
    global: ["update_environment"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateBricks: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

r(router, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_environment"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateBricks: true,
  },
  schema: createSingle.schema,
  controller: createSingle.controller,
});

r(router, {
  method: "post",
  path: "/:key/migrate",
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

export default router;
