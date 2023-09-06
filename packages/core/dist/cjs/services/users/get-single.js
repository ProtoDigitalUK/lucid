"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../users/index.js"));
const format_user_js_1 = __importDefault(require("../../utils/format/format-user.js"));
const getSingle = async (client, data) => {
    const user = await (0, service_js_1.default)(index_js_1.default.getSingleQuery, false, client)({
        user_id: data.user_id,
        email: data.email,
        username: data.username,
    });
    if (!user) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "There was an error finding the user.",
            status: 500,
        });
    }
    const userPermissions = await (0, service_js_1.default)(index_js_1.default.getPermissions, false, client)({
        user_id: user.id,
    });
    return (0, format_user_js_1.default)(user, userPermissions);
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map