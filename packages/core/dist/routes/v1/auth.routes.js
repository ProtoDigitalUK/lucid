"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("@utils/route"));
const login_1 = __importDefault(require("@controllers/auth/login"));
const logout_1 = __importDefault(require("@controllers/auth/logout"));
const get_authenticated_user_1 = __importDefault(require("@controllers/auth/get-authenticated-user"));
const get_csrf_1 = __importDefault(require("@controllers/auth/get-csrf"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/login",
    authoriseCSRF: true,
    schema: login_1.default.schema,
    controller: login_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/logout",
    authenticate: false,
    authoriseCSRF: false,
    schema: logout_1.default.schema,
    controller: logout_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/me",
    authenticate: true,
    authoriseCSRF: true,
    schema: get_authenticated_user_1.default.schema,
    controller: get_authenticated_user_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/csrf",
    schema: get_csrf_1.default.schema,
    controller: get_csrf_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map