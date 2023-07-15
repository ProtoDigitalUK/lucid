"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const users_1 = __importDefault(require("../users"));
const format_user_1 = __importDefault(require("../../utils/format/format-user"));
const getSingle = async (data) => {
    const user = await User_1.default.getById(data.user_id);
    if (!user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "There was an error finding the user.",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                id: {
                    code: "user_not_found",
                    message: "There was an error finding the user.",
                },
            }),
        });
    }
    const userPermissions = await users_1.default.getPermissions({
        user_id: user.id,
    });
    return (0, format_user_1.default)(user, userPermissions);
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map