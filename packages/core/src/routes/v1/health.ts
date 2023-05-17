import { Router } from "express";
import r from "../../utils/route";
// Controller
import getHealth from "../../controllers/health/get-health";
// Middleware

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  controller: getHealth,
});

export default router;
