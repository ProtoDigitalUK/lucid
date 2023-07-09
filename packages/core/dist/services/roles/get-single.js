"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("../../db/models/Role"));
const getSingle = async (data) => {
    const role = await Role_1.default.getSingle(data.id);
    return role;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map