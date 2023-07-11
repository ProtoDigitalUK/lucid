"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_roles_1 = __importDefault(require("./update-roles"));
const format_permissions_1 = __importDefault(require("./format-permissions"));
const get_all_roles_1 = __importDefault(require("./get-all-roles"));
const get_permissions_1 = __importDefault(require("./get-permissions"));
const get_single_1 = __importDefault(require("./get-single"));
const format_1 = __importDefault(require("./format"));
exports.default = {
    updateRoles: update_roles_1.default,
    formatPermissions: format_permissions_1.default,
    getAllRoles: get_all_roles_1.default,
    getPermissions: get_permissions_1.default,
    getSingle: get_single_1.default,
    format: format_1.default,
};
//# sourceMappingURL=index.js.map