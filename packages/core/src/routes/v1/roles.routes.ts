import { Router } from "express";
import r from "@utils/app/route";
// Controller
import createSingle from "@controllers/roles/create-single";
import deleteSingle from "@controllers/roles/delete-single";
import updateSingle from "@controllers/roles/update-single";
import getMultiple from "@controllers/roles/get-multiple";
import getSingle from "@controllers/roles/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

r(router, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

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

r(router, {
  method: "patch",
  path: "/:id",
  permissions: {
    global: ["update_role"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

export default router;
