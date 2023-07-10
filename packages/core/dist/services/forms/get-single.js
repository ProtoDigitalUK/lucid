"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../db/models/Config"));
const error_handler_1 = require("../../utils/app/error-handler");
const environments_1 = __importDefault(require("../environments"));
const forms_1 = __importDefault(require("../forms"));
const getSingle = async (data) => {
    const formInstances = Config_1.default.forms || [];
    const environment = await environments_1.default.getSingle({
        key: data.environment_key,
    });
    const allForms = formInstances.map((form) => forms_1.default.format(form));
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
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map