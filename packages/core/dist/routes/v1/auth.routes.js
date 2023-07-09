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
const register_superadmin_1 = __importDefault(require("../../controllers/auth/register-superadmin"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/login",
    middleware: {
        authoriseCSRF: true,
    },
    schema: login_1.default.schema,
    controller: login_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/logout",
    schema: logout_1.default.schema,
    controller: logout_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/me",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
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
    path: "/register-superadmin",
    middleware: {
        authoriseCSRF: true,
    },
    schema: register_superadmin_1.default.schema,
    controller: register_superadmin_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map