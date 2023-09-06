"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const update_me_js_1 = __importDefault(require("../../controllers/account/update-me.js"));
const router = (0, express_1.Router)();
(0, route_js_1.default)(router, {
    method: "patch",
    path: "/",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_me_js_1.default.schema,
    controller: update_me_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=account.routes.js.map