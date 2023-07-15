"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Role_1 = __importDefault(require("../../db/models/Role"));
const getSingle = async (client, data) => {
    const role = await Role_1.default.getSingle(client, {
        id: data.id,
    });
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error getting the role.",
            status: 500,
        });
    }
    return role;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map