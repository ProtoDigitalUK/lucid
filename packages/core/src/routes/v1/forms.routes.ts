import { Router } from "express";
import r from "@utils/route";
// Controller

// Submissions
import getSingleSubmission from "@controllers/form-submissions/get-single";
import getMultipleSubmissions from "@controllers/form-submissions/get-multiple";
import toggleReadAtSubmissions from "@controllers/form-submissions/toggle-read-at";

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

r(router, {
  method: "patch",
  path: "/:form_key/submissions/:id/read",
  permissions: {
    environments: ["read_form_submissions"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: toggleReadAtSubmissions.schema,
  controller: toggleReadAtSubmissions.controller,
});

export default router;
