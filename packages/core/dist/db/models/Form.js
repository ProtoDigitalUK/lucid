"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Form_filterEnvironmentForms;
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/error-handler");
const Config_1 = __importDefault(require("../models/Config"));
const Environment_1 = __importDefault(require("../models/Environment"));
class Form {
}
_a = Form;
Form.getSingle = async (data) => {
    const formInstances = Form.getFormBuilderConfig();
    if (!formInstances) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form not found",
            message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const environment = await Environment_1.default.getSingle(data.environment_key);
    const allForms = formInstances.map((form) => Form.getFormBuilderData(form));
    const assignedForms = environment.assigned_forms || [];
    const formData = allForms.find((c) => {
        return c.key === data.key && assignedForms.includes(c.key);
    });
    if (!formData) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form not found",
            message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    return formData;
};
Form.getAll = async (query, environment_key) => {
    const formInstances = Form.getFormBuilderConfig();
    if (!formInstances) {
        return [];
    }
    let forms = formInstances.map((form) => Form.getFormBuilderData(form));
    const environment = await Environment_1.default.getSingle(environment_key);
    forms = __classPrivateFieldGet(Form, _a, "f", _Form_filterEnvironmentForms).call(Form, environment.assigned_forms || [], forms);
    const formsRes = forms.map((form) => {
        if (!query.include?.includes("fields")) {
            delete form.fields;
        }
        return form;
    });
    return formsRes;
};
Form.getFormBuilderConfig = () => {
    const formBuilderInstances = Config_1.default.forms;
    if (!formBuilderInstances) {
        return [];
    }
    else {
        return formBuilderInstances;
    }
};
Form.getFormBuilderData = (instance) => {
    const data = {
        key: instance.key,
        title: instance.options.title,
        description: instance.options.description || null,
        fields: instance.options.fields,
    };
    return data;
};
_Form_filterEnvironmentForms = { value: (environment_forms, forms) => {
        return forms.filter((form) => environment_forms.includes(form.key));
    } };
exports.default = Form;
//# sourceMappingURL=Form.js.map