import { Router } from "express";
import r from "@utils/app/route";
// Controller
import getSinglePublic from "@controllers/options/get-single-public";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/public/:name",
  schema: getSinglePublic.schema,
  controller: getSinglePublic.controller,
});

export default router;
