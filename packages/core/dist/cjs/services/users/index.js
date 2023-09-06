"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_roles_js_1 = __importDefault(require("./update-roles.js"));
const get_permissions_js_1 = __importDefault(require("./get-permissions.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const register_single_js_1 = __importDefault(require("./register-single.js"));
const check_if_user_exists_js_1 = __importDefault(require("./check-if-user-exists.js"));
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
const get_multiple_js_1 = __importDefault(require("./get-multiple.js"));
const update_single_js_1 = __importDefault(require("./update-single.js"));
const get_single_query_js_1 = __importDefault(require("./get-single-query.js"));
exports.default = {
    updateRoles: update_roles_js_1.default,
    getPermissions: get_permissions_js_1.default,
    getSingle: get_single_js_1.default,
    registerSingle: register_single_js_1.default,
    checkIfUserExists: check_if_user_exists_js_1.default,
    deleteSingle: delete_single_js_1.default,
    getMultiple: get_multiple_js_1.default,
    updateSingle: update_single_js_1.default,
    getSingleQuery: get_single_query_js_1.default,
};
//# sourceMappingURL=index.js.map