import { Router } from "express";
import r from "@utils/route";
// Controller
import getHealth from "@controllers/health/get-health";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  permissions: ["create_user"],
  schema: getHealth.schema,
  controller: getHealth.controller,
});

export default router;
