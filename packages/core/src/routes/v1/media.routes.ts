import { Router } from "express";
import r from "@utils/route";
// Controller
import createSingle from "@controllers/media/create-single";

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

export default router;
