"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = __importDefault(require("../../db/models/Email"));
const resendSingle = async (data) => {
    const email = await Email_1.default.resendSingle(data.id);
    return email;
};
exports.default = resendSingle;
//# sourceMappingURL=resend-single.js.map