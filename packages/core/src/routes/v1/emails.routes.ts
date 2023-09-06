import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import getMultiple from "@controllers/email/get-multiple.js";
import getSingle from "@controllers/email/get-single.js";
import deleteSingle from "@controllers/email/delete-single.js";
import resendSingle from "@controllers/email/resend-single.js";

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
  path: "/:id/resend",
  permissions: {
    global: ["send_email"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
  },
  schema: resendSingle.schema,
  controller: resendSingle.controller,
});

export default router;
