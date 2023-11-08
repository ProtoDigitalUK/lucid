import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import updateSingle from "@controllers/users/update-single.js";
import createSingle from "@controllers/users/create-single.js";
import deleteSingle from "@controllers/users/delete-single.js";
import getMultiple from "@controllers/users/get-multiple.js";
import getSingle from "@controllers/users/get-single.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "patch",
  path: "/:id",
  permissions: {
    global: ["update_user"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
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

export default router;
