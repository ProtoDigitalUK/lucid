import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/pages/create-single.js";
import getMultiple from "@controllers/pages/get-multiple.js";
import getSingle from "@controllers/pages/get-single.js";
import updateSingle from "@controllers/pages/update-single.js";
import deleteSingle from "@controllers/pages/delete-single.js";
import deleteMultiple from "@controllers/pages/delete-multiple.js";
import getMultipleValidParents from "@controllers/pages/get-multiple-valid-parents.js";
import updateSingleBricksController from "@controllers/pages/update-single-bricks.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/:id/valid-parents",
  middleware: {
    authenticate: true,
    validateEnvironment: true,
    paginated: true,
  },
  schema: getMultipleValidParents.schema,
  controller: getMultipleValidParents.controller,
});

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
    contentLanguage: true,
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
  method: "patch",
  path: "/:collection_key/:id/bricks",
  permissions: {
    environments: ["update_content"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: updateSingleBricksController.schema,
  controller: updateSingleBricksController.controller,
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

r(router, {
  method: "delete",
  path: "/",
  permissions: {
    environments: ["delete_content"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: deleteMultiple.schema,
  controller: deleteMultiple.controller,
});

export default router;
