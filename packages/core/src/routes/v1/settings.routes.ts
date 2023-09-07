import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import getSettings from "@controllers/settings/get-settings.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
  },
  schema: getSettings.schema,
  controller: getSettings.controller,
});

export default router;
