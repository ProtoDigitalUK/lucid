"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const get_all_js_1 = __importDefault(require("../../controllers/collections/get-all.js"));
const get_single_js_1 = __importDefault(require("../../controllers/collections/get-single.js"));
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
//# sourceMappingURL=collections.routes.js.map