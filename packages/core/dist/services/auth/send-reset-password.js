"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const constants_1 = __importDefault(require("../../constants"));
const User_1 = __importDefault(require("../../db/models/User"));
const user_tokens_1 = __importDefault(require("../user-tokens"));
const email_1 = __importDefault(require("../email"));
const Config_1 = __importDefault(require("../Config"));
const sendResetPassword = async (data) => {
    const successMessage = `If an account with that email exists, we sent you an email with instructions to reset your password.`;
    const user = await User_1.default.getByEmail({
        email: data.email,
    });
    if (!user) {
        return {
            message: successMessage,
        };
    }
    const expiryDate = (0, date_fns_1.add)(new Date(), { hours: 1 }).toISOString();
    const userToken = await user_tokens_1.default.createSingle({
        user_id: user.id,
        token_type: "password_reset",
        expiry_date: expiryDate,
    });
    await email_1.default.sendEmailInternal("reset-password", {
        data: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            url: `${Config_1.default.host}${constants_1.default.locations.resetPassword}?token=${userToken.token}`,
        },
        options: {
            to: user.email,
            subject: "Reset your password",
        },
    });
    return {
        message: successMessage,
    };
};
exports.default = sendResetPassword;
//# sourceMappingURL=send-reset-password.js.map