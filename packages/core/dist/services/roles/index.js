"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_1 = __importDefault(require("./create-single"));
const delete_single_1 = __importDefault(require("./delete-single"));
const get_multiple_1 = __importDefault(require("./get-multiple"));
const get_single_1 = __importDefault(require("./get-single"));
const update_single_1 = __importDefault(require("./update-single"));
const check_name_unique_1 = __importDefault(require("./check-name-unique"));
const validate_permissions_1 = __importDefault(require("./validate-permissions"));
exports.default = {
    createSingle: create_single_1.default,
    deleteSingle: delete_single_1.default,
    getMultiple: get_multiple_1.default,
    getSingle: get_single_1.default,
    updateSingle: update_single_1.default,
    checkNameIsUnique: check_name_unique_1.default,
    validatePermissions: validate_permissions_1.default,
};
//# sourceMappingURL=index.js.map