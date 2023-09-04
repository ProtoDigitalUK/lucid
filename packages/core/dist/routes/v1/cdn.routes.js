"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const stream_single_1 = __importDefault(require("../../controllers/media/stream-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/:key",
    schema: stream_single_1.default.schema,
    controller: stream_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=cdn.routes.js.map