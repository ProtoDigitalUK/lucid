"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_tokens_1 = __importDefault(require("../user-tokens"));
const email_1 = __importDefault(require("../email"));
const users_1 = __importDefault(require("../users"));
const resetPassword = async (data) => {
    const successMessage = `You have successfully reset your password. Please login with your new password.`;
    const userToken = await user_tokens_1.default.getSingle({
        token_type: "password_reset",
        token: data.token,
    });
    const user = await users_1.default.updatePassword({
        user_id: userToken.user_id,
        password: data.password,
    });
    await user_tokens_1.default.deleteSingle({
        id: userToken.id,
    });
    await email_1.default.sendEmailInternal("password-reset", {
        data: {
            first_name: user.first_name,
            last_name: user.last_name,
        },
        options: {
            to: user.email,
            subject: "Your password has been reset",
        },
    });
    return {
        message: successMessage,
    };
};
exports.default = resetPassword;
//# sourceMappingURL=reset-password.js.map