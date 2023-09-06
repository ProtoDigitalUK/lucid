"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const UserToken_js_1 = __importDefault(require("../../db/models/UserToken.js"));
const createSingle = async (client, data) => {
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const userToken = await UserToken_js_1.default.createSingle(client, {
        user_id: data.user_id,
        token_type: data.token_type,
        token,
        expiry_date: data.expiry_date,
    });
    if (!userToken) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error creating user token",
            message: "There was an error creating the user token.",
            status: 500,
        });
    }
    return userToken;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map