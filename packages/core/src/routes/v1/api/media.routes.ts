import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/media/create-single.js";
import getMultiple from "@controllers/media/get-multiple.js";
import getSingle from "@controllers/media/get-single.js";
import deleteSingle from "@controllers/media/delete-single.js";
import updateSingle from "@controllers/media/update-single.js";
import clearSingleProcessed from "@controllers/media/clear-single-processed.js";
import clearAllProcessed from "@controllers/media/clear-all-processed.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "delete",
  path: "/processed",
  permissions: {
    global: ["update_media"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: clearAllProcessed.schema,
  controller: clearAllProcessed.controller,
});

r(router, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_media"],
  },
  middleware: {
    fileUpload: true,
    authenticate: true,
    authoriseCSRF: true,
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
    contentLanguage: true,
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
  method: "delete",
  path: "/:id",
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
  path: "/:id",
  permissions: {
    global: ["update_media"],
  },
  middleware: {
    fileUpload: true,
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:id/processed",
  permissions: {
    global: ["update_media"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: clearSingleProcessed.schema,
  controller: clearSingleProcessed.controller,
});

export default router;
