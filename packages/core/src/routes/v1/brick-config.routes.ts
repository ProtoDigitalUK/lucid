import { Router } from "express";
import r from "@utils/route";
// Controller
import getAll from "@controllers/brick-config/get-all";
import getSingle from "@controllers/brick-config/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/:collection_key/all",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: getAll.schema,
  controller: getAll.controller,
});

r(router, {
  method: "get",
  path: "/:collection_key/:brick_key",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
