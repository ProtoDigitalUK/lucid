"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const Config_1 = __importDefault(require("../Config"));
const environments_1 = __importDefault(require("../environments"));
const format_form_1 = __importDefault(require("../../utils/format/format-form"));
const getAll = async (client, data) => {
    const formInstances = Config_1.default.forms || [];
    let formsRes = formInstances.map((form) => (0, format_form_1.default)(form));
    if (data.query.filter?.environment_key) {
        const environment = await (0, service_1.default)(environments_1.default.getSingle, false, client)({
            key: data.query.filter?.environment_key,
        });
        formsRes = formsRes.filter((form) => environment.assigned_forms.includes(form.key));
    }
    formsRes = formsRes.map((form) => {
        if (!data.query.include?.includes("fields")) {
            delete form.fields;
        }
        return form;
    });
    return formsRes;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map