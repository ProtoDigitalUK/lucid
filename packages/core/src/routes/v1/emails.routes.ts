import { Router } from "express";
import r from "@utils/route";
// Controller
import getMultiple from "@controllers/email/get-multiple";
import getSingle from "@controllers/email/get-single";
import deleteSingle from "@controllers/email/delete-single";
import tempSend from "@controllers/email/temp-send";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  permissions: {
    global: ["read_email"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    paginated: true,
  },
  schema: getMultiple.schema,
  controller: getMultiple.controller,
});

r(router, {
  method: "get",
  path: "/:id",
  permissions: {
    global: ["read_email"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

r(router, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_email"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: deleteSingle.schema,
  controller: deleteSingle.controller,
});

r(router, {
  method: "post",
  path: "/temp-send",
  permissions: {
    global: ["send_email"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: tempSend.schema,
  controller: tempSend.controller,
});

export default router;
