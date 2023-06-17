import { Router } from "express";
import r from "@utils/route";
// Controller
import getAll from "@controllers/bricks/get-all";
import getSingle from "@controllers/bricks/get-single";

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
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
