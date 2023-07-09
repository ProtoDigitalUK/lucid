"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("../../db/models/Role"));
const createSingle = async (data) => {
    const role = await Role_1.default.createSingle({
        name: data.name,
        permission_groups: data.permission_groups,
    });
    return role;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map