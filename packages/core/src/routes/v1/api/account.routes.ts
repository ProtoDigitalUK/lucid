import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import updateMe from "@controllers/account/update-me.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "patch",
  path: "/",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: updateMe.schema,
  controller: updateMe.controller,
});

export default router;
