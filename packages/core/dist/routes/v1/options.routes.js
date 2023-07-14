"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const get_single_public_1 = __importDefault(require("../../controllers/options/get-single-public"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/public/:name",
    schema: get_single_public_1.default.schema,
    controller: get_single_public_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=options.routes.js.map