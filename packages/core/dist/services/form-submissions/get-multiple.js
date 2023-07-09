"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const getMultiple = async (data) => {
    const formSubmissions = await FormSubmission_1.default.getMultiple(data.query, {
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    return formSubmissions;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map