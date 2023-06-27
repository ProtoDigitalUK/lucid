import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/menu/create-single";

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

export default router;
