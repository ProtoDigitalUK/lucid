"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/route"));
const get_all_1 = __importDefault(require("../../controllers/environments/get-all"));
const get_single_1 = __importDefault(require("../../controllers/environments/get-single"));
const update_single_1 = __importDefault(require("../../controllers/environments/update-single"));
const migrate_envrionment_1 = __importDefault(require("../../controllers/environments/migrate-envrionment"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: get_all_1.default.schema,
    controller: get_all_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/:key",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "patch",
    path: "/:key",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateBricks: true,
    },
    schema: update_single_1.default.schema,
    controller: update_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/:key/migrate",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: migrate_envrionment_1.default.schema,
    controller: migrate_envrionment_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=environments.routes.js.map