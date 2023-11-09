import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getSingle from "@controllers/form/get-single.js";
import getAll from "@controllers/form/get-all.js";
// Submissions
import getSingleSubmission from "@controllers/form-submissions/get-single.js";
import getMultipleSubmissions from "@controllers/form-submissions/get-multiple.js";
import toggleReadAtSubmissions from "@controllers/form-submissions/toggle-read-at.js";
import deleteSingleSubmission from "@controllers/form-submissions/delete-single.js";

const formRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/:form_key",
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

  r(fastify, {
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
    },
    schema: getAll.schema,
    controller: getAll.controller,
  });

  // Submission routes
  r(fastify, {
    method: "get",
    url: "/:form_key/submissions/:id",
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

  r(fastify, {
    method: "get",
    url: "/:form_key/submissions",
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

  r(fastify, {
    method: "patch",
    url: "/:form_key/submissions/:id/read",
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

  r(fastify, {
    method: "delete",
    url: "/:form_key/submissions/:id",
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
};

export default formRoutes;
