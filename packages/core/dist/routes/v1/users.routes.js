"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const update_single_1 = __importDefault(require("../../controllers/users/update-single"));
const create_single_1 = __importDefault(require("../../controllers/users/create-single"));
const delete_single_1 = __importDefault(require("../../controllers/users/delete-single"));
const get_multiple_1 = __importDefault(require("../../controllers/users/get-multiple"));
const get_single_1 = __importDefault(require("../../controllers/users/get-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "patch",
    path: "/:id",
    permissions: {
        global: ["update_user"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_single_1.default.schema,
    controller: update_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        global: ["create_user"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: create_single_1.default.schema,
    controller: create_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "delete",
    path: "/:id",
    permissions: {
        global: ["delete_user"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: delete_single_1.default.schema,
    controller: delete_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
        paginated: true,
    },
    schema: get_multiple_1.default.schema,
    controller: get_multiple_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/:id",
    middleware: {
        authenticate: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=users.routes.js.map