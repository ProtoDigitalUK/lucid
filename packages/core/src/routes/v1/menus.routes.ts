import { Router } from "express";
import r from "@utils/app/route";
// Controller
import createSingle from "@controllers/menu/create-single";
import deleteSingle from "@controllers/menu/delete-single";
import getSingle from "@controllers/menu/get-single";
import getMultiple from "@controllers/menu/get-multiple";
import updateSingle from "@controllers/menu/update-single";

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

r(router, {
  method: "get",
  path: "/",
  permissions: {
    environments: ["read_menu"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    paginated: true,
    validateEnvironment: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

r(router, {
  method: "patch",
  path: "/:id",
  permissions: {
    environments: ["update_menu"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

export default router;
