"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const create_single_1 = __importDefault(require("../../controllers/roles/create-single"));
const delete_single_1 = __importDefault(require("../../controllers/roles/delete-single"));
const update_single_1 = __importDefault(require("../../controllers/roles/update-single"));
const get_multiple_1 = __importDefault(require("../../controllers/roles/get-multiple"));
const get_single_1 = __importDefault(require("../../controllers/roles/get-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    permissions: {
        global: ["read_role"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        paginated: true,
    },
    schema: get_multiple_1.default.schema,
    controller: get_multiple_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/:id",
    permissions: {
        global: ["read_role"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        global: ["create_role"],
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
        global: ["delete_role"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: delete_single_1.default.schema,
    controller: delete_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "patch",
    path: "/:id",
    permissions: {
        global: ["update_role"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_single_1.default.schema,
    controller: update_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=roles.routes.js.map