import { Router } from "express";
import r from "@utils/route";
// Controller
import updateSingle from "@controllers/groups/update-single";
import getSingle from "@controllers/groups/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "patch",
  path: "/:collection_key",
  permissions: {
    environments: ["update_content"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateBricks: true,
    validateEnvironment: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

r(router, {
  method: "get",
  path: "/:collection_key",
  permissions: {
    environments: ["read_content"],
  },
  middleware: {
    authenticate: false,
    authoriseCSRF: false,
    validateBricks: false,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
