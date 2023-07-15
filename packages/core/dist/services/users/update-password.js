"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const users_1 = __importDefault(require("../users"));
const format_user_1 = __importDefault(require("../../utils/format/format-user"));
const updatePassword = async (data) => {
    await users_1.default.getSingle({
        user_id: data.user_id,
    });
    const hashedPassword = await argon2_1.default.hash(data.password);
    const user = await User_1.default.updatePassword(data.user_id, hashedPassword);
    if (!user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Updated",
            message: "The user's password was not updated.",
            status: 500,
        });
    }
    return (0, format_user_1.default)(user);
};
exports.default = updatePassword;
//# sourceMappingURL=update-password.js.map