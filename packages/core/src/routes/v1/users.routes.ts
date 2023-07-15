import { Router } from "express";
import r from "@utils/app/route";
// Controller
import updateRoles from "@controllers/users/update-roles";
import createSingle from "@controllers/users/create-single";
import deleteSingle from "@controllers/users/delete-single";
import getMultiple from "@controllers/users/get-multiple";

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
  schema: createSingle.schema,
  controller: createSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_user"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: deleteSingle.schema,
  controller: deleteSingle.controller,
});

r(router, {
  method: "get",
  path: "/",
  permissions: {
    global: ["read_users"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    paginated: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

export default router;
