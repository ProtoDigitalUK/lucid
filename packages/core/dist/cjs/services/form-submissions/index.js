"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
const get_multiple_js_1 = __importDefault(require("./get-multiple.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const toggle_read_at_js_1 = __importDefault(require("./toggle-read-at.js"));
const submit_form_js_1 = __importDefault(require("./submit-form.js"));
const has_environment_permission_js_1 = __importDefault(require("./has-environment-permission.js"));
const create_single_js_1 = __importDefault(require("./create-single.js"));
exports.default = {
    deleteSingle: delete_single_js_1.default,
    getMultiple: get_multiple_js_1.default,
    getSingle: get_single_js_1.default,
    toggleReadAt: toggle_read_at_js_1.default,
    submitForm: submit_form_js_1.default,
    hasEnvironmentPermission: has_environment_permission_js_1.default,
    createSingle: create_single_js_1.default,
};
//# sourceMappingURL=index.js.map