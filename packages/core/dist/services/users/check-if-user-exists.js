"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const format_user_1 = __importDefault(require("../../utils/format/format-user"));
const checkIfUserExists = async (data) => {
    const user = await User_1.default.checkIfUserExistsAlready(data.email, data.username);
    if (user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                email: {
                    code: "email_already_exists",
                    message: "A user with that email already exists.",
                },
                username: {
                    code: "username_already_exists",
                    message: "A user with that username already exists.",
                },
            }),
        });
    }
    return (0, format_user_1.default)(user);
};
exports.default = checkIfUserExists;
//# sourceMappingURL=check-if-user-exists.js.map