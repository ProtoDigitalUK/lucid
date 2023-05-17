import { Router } from "express";
import r from "@utils/route";
// Controller
import me, { params } from "@controllers/auth/me";
// Middleware

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/me/:id",
  schema: {
    params: params,
  },
  controller: me,
});

export default router;
