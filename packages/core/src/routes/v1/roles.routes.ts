import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/roles/create-single";

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

export default router;
