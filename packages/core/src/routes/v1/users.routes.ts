import { Router } from "express";
import r from "@utils/route";
// Controller
import updateRoles from "@controllers/users/update-roles";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/:id/roles",
  permissions: ["assign_role"],
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateRoles.schema,
  controller: updateRoles.controller,
});

export default router;
