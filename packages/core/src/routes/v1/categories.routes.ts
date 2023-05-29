import { Router } from "express";
import r from "@utils/route";
// Controller
import getMultiple from "@controllers/categories/get-multiple";
import createSingle from "@controllers/categories/create-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    paginated: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

r(router, {
  method: "post",
  path: "/",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: createSingle.schema,
  controller: createSingle.controller,
});

export default router;
