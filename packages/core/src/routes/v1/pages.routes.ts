import { Router } from "express";
import r from "@utils/app/route";
// Controller
import createSingle from "@controllers/pages/create-single";
import getMultiple from "@controllers/pages/get-multiple";
import getSingle from "@controllers/pages/get-single";
import updateSingle from "@controllers/pages/update-single";
import deleteSingle from "@controllers/pages/delete-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/",
  permissions: {
    environments: ["create_content"],
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
  method: "patch",
  path: "/:id",
  permissions: {
    environments: ["update_content"],
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
    environments: ["delete_content"],
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
