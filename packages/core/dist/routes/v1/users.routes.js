"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const update_roles_1 = __importDefault(require("../../controllers/users/update-roles"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "post",
    path: "/:id/roles",
    permissions: {
        global: ["assign_role"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_roles_1.default.schema,
    controller: update_roles_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=users.routes.js.map