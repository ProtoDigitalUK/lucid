import { Router } from "express";
import r from "@utils/app/route.js";
// Controller

// Config
import getAllConfig from "@controllers/brick-config/get-all.js";
import getSingleConfig from "@controllers/brick-config/get-single.js";

// ------------------------------------
// Router
const router = Router();

// Config
r(router, {
  method: "get",
  path: "/config",
  middleware: {
    authenticate: true,
  },
  schema: getAllConfig.schema,
  controller: getAllConfig.controller,
});

r(router, {
  method: "get",
  path: "/config/:brick_key",
  middleware: {
    authenticate: true,
  },
  schema: getSingleConfig.schema,
  controller: getSingleConfig.controller,
});

export default router;
