"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const login_1 = __importDefault(require("../../controllers/auth/login"));
const logout_1 = __importDefault(require("../../controllers/auth/logout"));
const get_authenticated_user_1 = __importDefault(require("../../controllers/auth/get-authenticated-user"));
const get_csrf_1 = __importDefault(require("../../controllers/auth/get-csrf"));
const send_reset_password_1 = __importDefault(require("../../controllers/auth/send-reset-password"));
const verify_reset_password_1 = __importDefault(require("../../controllers/auth/verify-reset-password"));
const reset_password_1 = __importDefault(require("../../controllers/auth/reset-password"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "post",
    path: "/login",
    middleware: {
        authoriseCSRF: true,
    },
    schema: login_1.default.schema,
    controller: login_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/logout",
    schema: logout_1.default.schema,
    controller: logout_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/me",
    middleware: {
        authenticate: true,
    },
    schema: get_authenticated_user_1.default.schema,
    controller: get_authenticated_user_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/csrf",
    schema: get_csrf_1.default.schema,
    controller: get_csrf_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/reset-password",
    middleware: {
        authoriseCSRF: true,
    },
    schema: send_reset_password_1.default.schema,
    controller: send_reset_password_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/reset-password/:token",
    schema: verify_reset_password_1.default.schema,
    controller: verify_reset_password_1.default.controller,
});
(0, route_1.default)(router, {
    method: "patch",
    path: "/reset-password/:token",
    middleware: {
        authoriseCSRF: true,
    },
    schema: reset_password_1.default.schema,
    controller: reset_password_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map