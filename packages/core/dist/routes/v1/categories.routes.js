"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/route"));
const get_multiple_1 = __importDefault(require("../../controllers/categories/get-multiple"));
const create_single_1 = __importDefault(require("../../controllers/categories/create-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        paginated: true,
    },
    schema: get_multiple_1.default.schema,
    controller: get_multiple_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: create_single_1.default.schema,
    controller: create_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=categories.routes.js.map