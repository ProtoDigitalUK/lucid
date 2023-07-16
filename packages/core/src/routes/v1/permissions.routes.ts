import { Router } from "express";
import r from "@utils/app/route";
// Controller
import getAll from "@controllers/permissions/get-all";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
  },
  schema: getAll.schema,
  controller: getAll.controller,
});

export default router;
