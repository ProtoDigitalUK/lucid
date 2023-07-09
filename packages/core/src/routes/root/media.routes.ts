import { Router } from "express";
import r from "@utils/route";
// Controller
import streamSingle from "@controllers/media/stream-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/:key",
  schema: streamSingle.schema,
  controller: streamSingle.controller,
});

export default router;
