"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const get_all_js_1 = __importDefault(require("../../controllers/environments/get-all.js"));
const get_single_js_1 = __importDefault(require("../../controllers/environments/get-single.js"));
const update_single_js_1 = __importDefault(require("../../controllers/environments/update-single.js"));
const create_single_js_1 = __importDefault(require("../../controllers/environments/create-single.js"));
const delete_single_js_1 = __importDefault(require("../../controllers/environments/delete-single.js"));
const migrate_envrionment_js_1 = __importDefault(require("../../controllers/environments/migrate-envrionment.js"));
const router = (0, express_1.Router)();
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
    method: "delete",
    path: "/:key",
    permissions: {
        global: ["delete_environment"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: delete_single_js_1.default.schema,
    controller: delete_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/:key",
    middleware: {
        authenticate: true,
    },
    schema: get_single_js_1.default.schema,
    controller: get_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "patch",
    path: "/:key",
    permissions: {
        global: ["update_environment"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_single_js_1.default.schema,
    controller: update_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        global: ["create_environment"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: create_single_js_1.default.schema,
    controller: create_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "post",
    path: "/:key/migrate",
    permissions: {
        global: ["migrate_environment"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: migrate_envrionment_js_1.default.schema,
    controller: migrate_envrionment_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=environments.routes.js.map