import { Router } from "express";
import r from "@utils/route";
// Controller
import getAll from "@controllers/environments/get-all";
import getSingle from "@controllers/environments/get-single";
import updateSingle from "@controllers/environments/update-single";
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
  path: "/:key/migrate",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: migrateEnvrionment.schema,
  controller: migrateEnvrionment.controller,
});

export default router;
