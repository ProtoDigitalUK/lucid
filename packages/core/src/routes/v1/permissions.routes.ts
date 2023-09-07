import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import getAll from "@controllers/permissions/get-all.js";

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
