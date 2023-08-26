import { Router } from "express";
import r from "@utils/app/route";
// Controller
import getMultiple from "@controllers/categories/get-multiple";
import createSingle from "@controllers/categories/create-single";
import updateSingle from "@controllers/categories/update-single";
import deleteSingle from "@controllers/categories/delete-single";
import getSingle from "@controllers/categories/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
    validateEnvironment: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

r(router, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

r(router, {
  method: "post",
  path: "/",
  permissions: {
    environments: ["create_category"],
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
  method: "patch",
  path: "/:id",
  permissions: {
    environments: ["update_category"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:id",
  permissions: {
    environments: ["delete_category"],
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
