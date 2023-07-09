"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = __importDefault(require("../../db/models/Email"));
const getSingle = async (data) => {
    const email = await Email_1.default.getSingle(data.id);
    return email;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map