import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import createSingle from "@controllers/languages/create-single.js";
import getSingle from "@controllers/languages/get-single.js";
import getMultiple from "@controllers/languages/get-multiple.js";

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
  method: "post",
  path: "/",
  permissions: {
    global: ["create_language"],
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
  path: "/:code",
  middleware: {
    authenticate: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
