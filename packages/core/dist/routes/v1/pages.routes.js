"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const create_single_1 = __importDefault(require("../../controllers/pages/create-single"));
const get_multiple_1 = __importDefault(require("../../controllers/pages/get-multiple"));
const get_single_1 = __importDefault(require("../../controllers/pages/get-single"));
const update_single_1 = __importDefault(require("../../controllers/pages/update-single"));
const delete_single_1 = __importDefault(require("../../controllers/pages/delete-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        environments: ["create_content"],
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
    method: "get",
    path: "/",
    permissions: {
        environments: ["read_content"],
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
    method: "get",
    path: "/:id",
    permissions: {
        environments: ["read_content"],
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
    method: "patch",
    path: "/:id",
    permissions: {
        environments: ["update_content"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: update_single_1.default.schema,
    controller: update_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "delete",
    path: "/:id",
    permissions: {
        environments: ["delete_content"],
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
//# sourceMappingURL=pages.routes.js.map