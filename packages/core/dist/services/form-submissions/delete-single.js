"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const deleteSingle = async (data) => {
    const formSubmission = await FormSubmission_1.default.deleteSingle({
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    return formSubmission;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map