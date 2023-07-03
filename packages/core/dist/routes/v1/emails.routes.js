"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/route"));
const get_multiple_1 = __importDefault(require("../../controllers/email/get-multiple"));
const get_single_1 = __importDefault(require("../../controllers/email/get-single"));
const delete_single_1 = __importDefault(require("../../controllers/email/delete-single"));
const resend_single_1 = __importDefault(require("../../controllers/email/resend-single"));
const temp_send_1 = __importDefault(require("../../controllers/email/temp-send"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    permissions: {
        global: ["read_email"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        paginated: true,
    },
    schema: get_multiple_1.default.schema,
    controller: get_multiple_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/:id",
    permissions: {
        global: ["read_email"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "delete",
    path: "/:id",
    permissions: {
        global: ["delete_email"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: delete_single_1.default.schema,
    controller: delete_single_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/temp-send",
    permissions: {
        global: ["send_email"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: temp_send_1.default.schema,
    controller: temp_send_1.default.controller,
});
(0, route_1.default)(router, {
    method: "post",
    path: "/:id/resend",
    permissions: {
        global: ["send_email"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: resend_single_1.default.schema,
    controller: resend_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=emails.routes.js.map