"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const UserToken_js_1 = __importDefault(require("../../db/models/UserToken.js"));
const getSingle = async (client, data) => {
    const userToken = await UserToken_js_1.default.getByToken(client, {
        token_type: data.token_type,
        token: data.token,
    });
    if (!userToken) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Invalid token",
            message: "The provided token is either invalid or expired. Please try again.",
            status: 400,
        });
    }
    return userToken;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map