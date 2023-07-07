"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/route"));
const get_single_1 = __importDefault(require("../../controllers/form/get-single"));
const get_all_1 = __importDefault(require("../../controllers/form/get-all"));
const get_single_2 = __importDefault(require("../../controllers/form-submissions/get-single"));
const get_multiple_1 = __importDefault(require("../../controllers/form-submissions/get-multiple"));
const toggle_read_at_1 = __importDefault(require("../../controllers/form-submissions/toggle-read-at"));
const delete_single_1 = __importDefault(require("../../controllers/form-submissions/delete-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/:form_key",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: get_all_1.default.schema,
    controller: get_all_1.default.controller,
});
(0, route_1.default)(router, {
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
    schema: get_single_2.default.schema,
    controller: get_single_2.default.controller,
});
(0, route_1.default)(router, {
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
    schema: get_multiple_1.default.schema,
    controller: get_multiple_1.default.controller,
});
(0, route_1.default)(router, {
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
    schema: toggle_read_at_1.default.schema,
    controller: toggle_read_at_1.default.controller,
});
(0, route_1.default)(router, {
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
    schema: delete_single_1.default.schema,
    controller: delete_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=forms.routes.js.map