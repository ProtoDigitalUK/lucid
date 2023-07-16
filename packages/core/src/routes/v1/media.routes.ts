import { Router } from "express";
import r from "@utils/app/route";
// Controller
import createSingle from "@controllers/media/create-single";
import getMultiple from "@controllers/media/get-multiple";
import getSingle from "@controllers/media/get-single";
import deleteSingle from "@controllers/media/delete-single";
import updateSingle from "@controllers/media/update-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_media"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: createSingle.schema,
  controller: createSingle.controller,
});

r(router, {
  method: "get",
  path: "/",
  permissions: {
    global: ["read_media"],
  },
  middleware: {
    authenticate: true,
    paginated: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

r(router, {
  method: "get",
  path: "/:key",
  permissions: {
    global: ["read_media"],
  },
  middleware: {
    authenticate: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:key",
  permissions: {
    global: ["delete_media"],
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
  path: "/:key",
  permissions: {
    global: ["update_media"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

export default router;
