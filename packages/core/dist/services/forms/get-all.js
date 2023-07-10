"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../db/models/Config"));
const environments_1 = __importDefault(require("../environments"));
const forms_1 = __importDefault(require("../forms"));
const getAll = async (data) => {
    const formInstances = Config_1.default.forms || [];
    let formsRes = formInstances.map((form) => forms_1.default.format(form));
    const environment = await environments_1.default.getSingle({
        key: data.environment_key,
    });
    formsRes = formsRes.filter((form) => environment.assigned_forms.includes(form.key));
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