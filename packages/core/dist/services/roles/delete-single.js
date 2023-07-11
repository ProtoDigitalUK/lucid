"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Role_1 = __importDefault(require("../../db/models/Role"));
const deleteSingle = async (data) => {
    const role = await Role_1.default.deleteSingle(data.id);
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error deleting the role.",
            status: 500,
        });
    }
    return role;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map