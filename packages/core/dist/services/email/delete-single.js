"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = __importDefault(require("../../db/models/Email"));
const deleteSingle = async (data) => {
    const email = await Email_1.default.deleteSingle(data.id);
    return email;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map