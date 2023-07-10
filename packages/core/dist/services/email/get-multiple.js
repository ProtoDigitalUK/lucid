"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = __importDefault(require("../../db/models/Email"));
const getMultiple = async (data) => {
    const emails = await Email_1.default.getMultiple(data.query);
    return emails;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map