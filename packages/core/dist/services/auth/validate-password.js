"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const validatePassword = async (data) => {
    return await argon2_1.default.verify(data.hashedPassword, data.password);
};
exports.default = validatePassword;
//# sourceMappingURL=validate-password.js.map