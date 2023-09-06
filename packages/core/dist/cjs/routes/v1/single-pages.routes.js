"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const update_single_js_1 = __importDefault(require("../../controllers/single-pages/update-single.js"));
const get_single_js_1 = __importDefault(require("../../controllers/single-pages/get-single.js"));
const router = (0, express_1.Router)();
(0, route_js_1.default)(router, {
    method: "patch",
    path: "/:collection_key",
    permissions: {
        environments: ["update_content"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: update_single_js_1.default.schema,
    controller: update_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/:collection_key",
    middleware: {
        authenticate: true,
        validateEnvironment: true,
    },
    schema: get_single_js_1.default.schema,
    controller: get_single_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=single-pages.routes.js.map