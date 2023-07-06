import { Router } from "express";
import r from "@utils/route";
// Controller

// Submissions
import getSingleSubmission from "@controllers/form-submissions/get-single";

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

export default router;
