import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/pages/create-single";
import getMultiple from "@controllers/pages/get-multiple";

// ------------------------------------
// Router
const router = Router();

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

export default router;
