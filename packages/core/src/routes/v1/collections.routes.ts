import { Router } from "express";
import r from "@utils/route";
// Controller
import getAll from "@controllers/collections/get-all";
import getSingle from "@controllers/collections/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: getAll.schema,
  controller: getAll.controller,
});

r(router, {
  method: "get",
  path: "/:collection_key",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
