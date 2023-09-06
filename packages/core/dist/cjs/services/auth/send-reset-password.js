"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const constants_js_1 = __importDefault(require("../../constants.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../user-tokens/index.js"));
const index_js_2 = __importDefault(require("../email/index.js"));
const index_js_3 = __importDefault(require("../users/index.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const sendResetPassword = async (client, data) => {
    const successMessage = `If an account with that email exists, we've sent you an email with instructions to reset your password.`;
    const user = await (0, service_js_1.default)(index_js_3.default.getSingleQuery, false, client)({
        email: data.email,
    });
    if (!user) {
        return {
            message: successMessage,
        };
    }
    const expiryDate = (0, date_fns_1.add)(new Date(), { hours: 1 }).toISOString();
    const userToken = await (0, service_js_1.default)(index_js_1.default.createSingle, false, client)({
        user_id: user.id,
        token_type: "password_reset",
        expiry_date: expiryDate,
    });
    await (0, service_js_1.default)(index_js_2.default.sendEmailInternal, false, client)({
        template: "reset-password",
        params: {
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                url: `${Config_js_1.default.host}${constants_js_1.default.locations.resetPassword}?token=${userToken.token}`,
            },
            options: {
                to: user.email,
                subject: "Reset your password",
            },
        },
    });
    return {
        message: successMessage,
    };
};
exports.default = sendResetPassword;
//# sourceMappingURL=send-reset-password.js.map