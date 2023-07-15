"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const users_1 = __importDefault(require("../users"));
const format_user_1 = __importDefault(require("../../utils/format/format-user"));
const getSingle = async (client, data) => {
    const user = await (0, service_1.default)(users_1.default.getSingleQuery, false, client)({
        user_id: data.user_id,
        email: data.email,
        username: data.username,
    });
    if (!user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "There was an error finding the user.",
            status: 500,
        });
    }
    const userPermissions = await (0, service_1.default)(users_1.default.getPermissions, false, client)({
        user_id: user.id,
    });
    return (0, format_user_1.default)(user, userPermissions);
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map