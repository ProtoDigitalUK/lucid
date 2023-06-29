import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/menu/create-single";
import deleteSingle from "@controllers/menu/delete-single";

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

export default router;
