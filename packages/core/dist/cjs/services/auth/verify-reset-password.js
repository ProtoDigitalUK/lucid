"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("../user-tokens/index.js"));
const verifyResetPassword = async (client, data) => {
    await index_js_1.default.getSingle(client, {
        token_type: "password_reset",
        token: data.token,
    });
    return {};
};
exports.default = verifyResetPassword;
//# sourceMappingURL=verify-reset-password.js.map