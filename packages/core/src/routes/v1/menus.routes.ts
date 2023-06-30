import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/menu/create-single";
import deleteSingle from "@controllers/menu/delete-single";
import getSingle from "@controllers/menu/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/",
  permissions: {
    environments: ["create_menu"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: createSingle.schema,
  controller: createSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:id",
  permissions: {
    environments: ["delete_menu"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: deleteSingle.schema,
  controller: deleteSingle.controller,
});

r(router, {
  method: "get",
  path: "/:id",
  permissions: {
    environments: ["read_menu"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
