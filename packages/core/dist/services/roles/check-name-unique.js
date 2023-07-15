"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Role_1 = __importDefault(require("../../db/models/Role"));
const checkNameIsUnique = async (client, data) => {
    const role = await Role_1.default.getSingleByName(client, {
        name: data.name,
    });
    if (role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "The role name must be unique.",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                name: {
                    code: "Not unique",
                    message: "The role name must be unique.",
                },
            }),
        });
    }
    return role;
};
exports.default = checkNameIsUnique;
//# sourceMappingURL=check-name-unique.js.map