"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_tokens_1 = __importDefault(require("../user-tokens"));
const verifyResetPassword = async (client, data) => {
    await user_tokens_1.default.getSingle(client, {
        token_type: "password_reset",
        token: data.token,
    });
    return {};
};
exports.default = verifyResetPassword;
//# sourceMappingURL=verify-reset-password.js.map