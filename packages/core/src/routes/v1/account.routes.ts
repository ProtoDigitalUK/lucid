import { Router } from "express";
import r from "@utils/app/route";
// Controller
import updateMe from "@controllers/account/update-me";

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
