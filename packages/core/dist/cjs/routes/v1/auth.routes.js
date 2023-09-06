"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const login_js_1 = __importDefault(require("../../controllers/auth/login.js"));
const logout_js_1 = __importDefault(require("../../controllers/auth/logout.js"));
const get_authenticated_user_js_1 = __importDefault(require("../../controllers/auth/get-authenticated-user.js"));
const get_csrf_js_1 = __importDefault(require("../../controllers/auth/get-csrf.js"));
const send_reset_password_js_1 = __importDefault(require("../../controllers/auth/send-reset-password.js"));
const verify_reset_password_js_1 = __importDefault(require("../../controllers/auth/verify-reset-password.js"));
const reset_password_js_1 = __importDefault(require("../../controllers/auth/reset-password.js"));
const router = (0, express_1.Router)();
(0, route_js_1.default)(router, {
    method: "post",
    path: "/login",
    middleware: {
        authoriseCSRF: true,
    },
    schema: login_js_1.default.schema,
    controller: login_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "post",
    path: "/logout",
    schema: logout_js_1.default.schema,
    controller: logout_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/me",
    middleware: {
        authenticate: true,
    },
    schema: get_authenticated_user_js_1.default.schema,
    controller: get_authenticated_user_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/csrf",
    schema: get_csrf_js_1.default.schema,
    controller: get_csrf_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "post",
    path: "/reset-password",
    middleware: {
        authoriseCSRF: true,
    },
    schema: send_reset_password_js_1.default.schema,
    controller: send_reset_password_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/reset-password/:token",
    schema: verify_reset_password_js_1.default.schema,
    controller: verify_reset_password_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "patch",
    path: "/reset-password/:token",
    middleware: {
        authoriseCSRF: true,
    },
    schema: reset_password_js_1.default.schema,
    controller: reset_password_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map