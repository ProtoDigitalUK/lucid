"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Email_1 = __importDefault(require("../../db/models/Email"));
const createSingle = async (client, data) => {
    const email = await Email_1.default.createSingle(client, data);
    if (!email) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Error saving email",
            status: 500,
        });
    }
    return email;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map