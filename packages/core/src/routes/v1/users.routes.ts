import { Router } from "express";
import r from "@utils/app/route";
// Controller
import updateRoles from "@controllers/users/update-roles";
import createUser from "@controllers/users/create-user";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/:id/roles",
  permissions: {
    global: ["assign_role"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateRoles.schema,
  controller: updateRoles.controller,
});

r(router, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_user"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: createUser.schema,
  controller: createUser.controller,
});

export default router;
