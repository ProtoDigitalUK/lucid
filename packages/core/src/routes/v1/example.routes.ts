import { Router } from "express";
import r from "@utils/route";
// Controller
import getSingle from "@controllers/example/get-single";
import throwError from "@controllers/example/throw-error";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/error",
  schema: throwError.schema,
  controller: throwError.controller,
});

r(router, {
  method: "get",
  path: "/:id",
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
