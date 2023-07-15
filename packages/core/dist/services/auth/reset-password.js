"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const user_tokens_1 = __importDefault(require("../user-tokens"));
const email_1 = __importDefault(require("../email"));
const users_1 = __importDefault(require("../users"));
const resetPassword = async (client, data) => {
    const successMessage = `You have successfully reset your password. Please login with your new password.`;
    const userToken = await (0, service_1.default)(user_tokens_1.default.getSingle, false, client)({
        token_type: "password_reset",
        token: data.token,
    });
    const user = await (0, service_1.default)(users_1.default.updateSingle, false, client)({
        user_id: userToken.user_id,
        password: data.password,
    });
    await (0, service_1.default)(user_tokens_1.default.deleteSingle, false, client)({
        id: userToken.id,
    });
    await (0, service_1.default)(email_1.default.sendEmailInternal, false, client)({
        template: "password-reset",
        params: {
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
            },
            options: {
                to: user.email,
                subject: "Your password has been reset",
            },
        },
    });
    return {
        message: successMessage,
    };
};
exports.default = resetPassword;
//# sourceMappingURL=reset-password.js.map