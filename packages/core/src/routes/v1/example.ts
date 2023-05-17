import { Router } from "express";
import r from "@utils/route";
// Controller
import getSingle from "@controllers/example/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/:id",
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
