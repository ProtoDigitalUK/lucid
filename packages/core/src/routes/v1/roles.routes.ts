import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/roles/create-single";
import deleteSingle from "@controllers/roles/delete-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_role"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: createSingle.schema,
  controller: createSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_role"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: deleteSingle.schema,
  controller: deleteSingle.controller,
});

export default router;
