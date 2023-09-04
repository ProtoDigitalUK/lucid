"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const get_settings_1 = __importDefault(require("../../controllers/settings/get-settings"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
    },
    schema: get_settings_1.default.schema,
    controller: get_settings_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=settings.routes.js.map