import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import getHealth from "@controllers/health/get-health.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  schema: getHealth.schema,
  controller: getHealth.controller,
});

export default router;
