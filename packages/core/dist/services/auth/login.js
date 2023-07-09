"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const login = async (data) => {
    const user = await User_1.default.login({
        username: data.username,
    });
    if (!user || !user.password) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The email or password you entered is incorrect.",
            status: 500,
        });
    }
    const passwordValid = await User_1.default.validatePassword(user.password, data.password);
    if (!passwordValid) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The email or password you entered is incorrect.",
            status: 500,
        });
    }
    delete user.password;
    return user;
};
exports.default = login;
//# sourceMappingURL=login.js.map