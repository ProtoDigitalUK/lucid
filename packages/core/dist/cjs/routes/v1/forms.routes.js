"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const get_single_js_1 = __importDefault(require("../../controllers/form/get-single.js"));
const get_all_js_1 = __importDefault(require("../../controllers/form/get-all.js"));
const get_single_js_2 = __importDefault(require("../../controllers/form-submissions/get-single.js"));
const get_multiple_js_1 = __importDefault(require("../../controllers/form-submissions/get-multiple.js"));
const toggle_read_at_js_1 = __importDefault(require("../../controllers/form-submissions/toggle-read-at.js"));
const delete_single_js_1 = __importDefault(require("../../controllers/form-submissions/delete-single.js"));
const router = (0, express_1.Router)();
(0, route_js_1.default)(router, {
    method: "get",
    path: "/:form_key",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
        validateEnvironment: true,
    },
    schema: get_single_js_1.default.schema,
    controller: get_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
    },
    schema: get_all_js_1.default.schema,
    controller: get_all_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/:form_key/submissions/:id",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
        validateEnvironment: true,
    },
    schema: get_single_js_2.default.schema,
    controller: get_single_js_2.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/:form_key/submissions",
    permissions: {
        environments: ["read_form_submissions"],
    },
    middleware: {
        authenticate: true,
        validateEnvironment: true,
    },
    schema: get_multiple_js_1.default.schema,
    controller: get_multiple_js_1.default.controller,
});
(0, route_js_1.default)(router, {
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
    schema: toggle_read_at_js_1.default.schema,
    controller: toggle_read_at_js_1.default.controller,
});
(0, route_js_1.default)(router, {
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
    schema: delete_single_js_1.default.schema,
    controller: delete_single_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=forms.routes.js.map