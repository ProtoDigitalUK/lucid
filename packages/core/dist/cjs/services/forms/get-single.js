"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const index_js_1 = __importDefault(require("../environments/index.js"));
const format_form_js_1 = __importDefault(require("../../utils/format/format-form.js"));
const getSingle = async (client, data) => {
    const formInstances = Config_js_1.default.forms || [];
    const environment = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        key: data.environment_key,
    });
    const allForms = formInstances.map((form) => (0, format_form_js_1.default)(form));
    const assignedForms = environment.assigned_forms || [];
    const formData = allForms.find((c) => {
        return c.key === data.key && assignedForms.includes(c.key);
    });
    if (!formData) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Form not found",
            message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    return formData;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map