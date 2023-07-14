"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_roles_1 = __importDefault(require("./update-roles"));
const get_all_roles_1 = __importDefault(require("./get-all-roles"));
const get_permissions_1 = __importDefault(require("./get-permissions"));
const get_single_1 = __importDefault(require("./get-single"));
const register_single_1 = __importDefault(require("./register-single"));
const register_superadmin_1 = __importDefault(require("./register-superadmin"));
const check_if_user_exists_1 = __importDefault(require("./check-if-user-exists"));
const update_password_1 = __importDefault(require("./update-password"));
exports.default = {
    updateRoles: update_roles_1.default,
    getAllRoles: get_all_roles_1.default,
    getPermissions: get_permissions_1.default,
    getSingle: get_single_1.default,
    registerSingle: register_single_1.default,
    registerSuperAdmin: register_superadmin_1.default,
    checkIfUserExists: check_if_user_exists_1.default,
    updatePassword: update_password_1.default,
};
//# sourceMappingURL=index.js.map