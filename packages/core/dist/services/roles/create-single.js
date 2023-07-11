"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Role_1 = __importDefault(require("../../db/models/Role"));
const roles_1 = __importDefault(require("../roles"));
const role_permissions_1 = __importDefault(require("../role-permissions"));
const createSingle = async (data) => {
    const parsePermissions = await roles_1.default.validatePermissions(data.permission_groups);
    await roles_1.default.checkNameIsUnique({
        name: data.name,
    });
    const role = await Role_1.default.createSingle({
        name: data.name,
        permission_groups: data.permission_groups,
    });
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error creating the role.",
            status: 500,
        });
    }
    if (data.permission_groups.length > 0) {
        try {
            await role_permissions_1.default.createMultiple({
                role_id: role.id,
                permissions: parsePermissions,
            });
        }
        catch (error) {
            await Role_1.default.deleteSingle(role.id);
            throw error;
        }
    }
    return role;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map