import { Router } from "express";
import r from "../../utils/app/route.js";
import getSingle from "../../controllers/form/get-single.js";
import getAll from "../../controllers/form/get-all.js";
import getSingleSubmission from "../../controllers/form-submissions/get-single.js";
import getMultipleSubmissions from "../../controllers/form-submissions/get-multiple.js";
import toggleReadAtSubmissions from "../../controllers/form-submissions/toggle-read-at.js";
import deleteSingleSubmission from "../../controllers/form-submissions/delete-single.js";
const router = Router();
r(router, {
    method: "get",
    path: "/:form_key",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
        validateEnvironment: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
});
r(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
    },
    schema: getAll.schema,
    controller: getAll.controller,
});
r(router, {
    method: "get",
    path: "/:form_key/submissions/:id",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
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
r(router, {
    method: "delete",
    path: "/:form_key/submissions/:id",
    permissions: {
        environments: ["delete_form_submissions"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: deleteSingleSubmission.schema,
    controller: deleteSingleSubmission.controller,
});
export default router;
//# sourceMappingURL=forms.routes.js.map