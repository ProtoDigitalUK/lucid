"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("../../db/models/Role"));
const deleteSingle = async (data) => {
    const role = await Role_1.default.deleteSingle(data.id);
    return role;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map