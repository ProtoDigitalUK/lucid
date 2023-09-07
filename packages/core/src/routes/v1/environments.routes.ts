import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import getAll from "@controllers/environments/get-all.js";
import getSingle from "@controllers/environments/get-single.js";
import updateSingle from "@controllers/environments/update-single.js";
import createSingle from "@controllers/environments/create-single.js";
import deleteSingle from "@controllers/environments/delete-single.js";
import migrateEnvrionment from "@controllers/environments/migrate-envrionment.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
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
