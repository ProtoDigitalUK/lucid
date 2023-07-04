"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/route"));
const create_single_1 = __importDefault(require("../../controllers/menu/create-single"));
const delete_single_1 = __importDefault(require("../../controllers/menu/delete-single"));
const get_single_1 = __importDefault(require("../../controllers/menu/get-single"));
const get_multiple_1 = __importDefault(require("../../controllers/menu/get-multiple"));
const update_single_1 = __importDefault(require("../../controllers/menu/update-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        environments: ["create_menu"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: create_single_1.default.schema,
    controller: create_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "delete",
    path: "/:id",
    permissions: {
        environments: ["delete_menu"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: delete_single_1.default.schema,
    controller: delete_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/:id",
    permissions: {
        environments: ["read_menu"],
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
        environments: ["read_menu"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        paginated: true,
        validateEnvironment: true,
    },
    schema: get_multiple_1.default.schema,
    controller: get_multiple_1.default.controller,
});
(0, route_1.default)(router, {
    method: "patch",
    path: "/:id",
    permissions: {
        environments: ["update_menu"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: update_single_1.default.schema,
    controller: update_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=menus.routes.js.map