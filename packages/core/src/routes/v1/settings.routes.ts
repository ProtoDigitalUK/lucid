import { Router } from "express";
import r from "@utils/app/route";
// Controller
import getSettings from "@controllers/settings/get-settings";

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
