import { Router } from "express";
import r from "@utils/route";
// Controller

// Submissions
import getSingleSubmission from "@controllers/form-submissions/get-single";
import getMultipleSubmissions from "@controllers/form-submissions/get-multiple";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/:form_key/submissions/:id",
  permissions: {
    environments: ["read_form_submissions"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: getSingleSubmission.schema,
  controller: getSingleSubmission.controller,
});

r(router, {
  method: "get",
  path: "/:form_key/submissions",
  permissions: {
    environments: ["read_form_submissions"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: getMultipleSubmissions.schema,
  controller: getMultipleSubmissions.controller,
});

export default router;
