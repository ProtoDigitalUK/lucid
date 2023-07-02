"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/route"));
const create_single_1 = __importDefault(require("../../controllers/media/create-single"));
const get_multiple_1 = __importDefault(require("../../controllers/media/get-multiple"));
const get_single_1 = __importDefault(require("../../controllers/media/get-single"));
const delete_single_1 = __importDefault(require("../../controllers/media/delete-single"));
const update_single_1 = __importDefault(require("../../controllers/media/update-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        global: ["create_media"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: create_single_1.default.schema,
    controller: create_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    permissions: {
        global: ["read_media"],
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
    path: "/:key",
    permissions: {
        global: ["read_media"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "delete",
    path: "/:key",
    permissions: {
        global: ["delete_media"],
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
    path: "/:key",
    permissions: {
        global: ["update_media"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_single_1.default.schema,
    controller: update_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=media.routes.js.map