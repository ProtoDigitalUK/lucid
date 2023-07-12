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
const registerSingle = async (data) => {
    await users_1.default.checkIfUserExists({
        email: data.email,
        username: data.username,
    });
    const hashedPassword = await argon2_1.default.hash(data.password);
    const user = await User_1.default.register({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        super_admin: data.super_admin,
    });
    if (!user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Created",
            message: "There was an error creating the user.",
            status: 500,
        });
    }
    const userPermissions = await users_1.default.getPermissions({
        user_id: user.id,
    });
    return (0, format_user_1.default)(user, userPermissions);
};
exports.default = registerSingle;
//# sourceMappingURL=register-single.js.map