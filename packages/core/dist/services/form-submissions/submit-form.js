"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_submissions_1 = __importDefault(require("../form-submissions"));
const submitForm = async (props) => {
    const data = [];
    for (let [key, value] of Object.entries(props.data)) {
        if (!value) {
            const defaultValue = props.form.options.fields.find((field) => field.name === key)?.default_value;
            if (defaultValue !== undefined) {
                value = defaultValue;
            }
        }
        const type = typeof value;
        if (type !== "string" && type !== "number" && type !== "boolean") {
            throw new Error("Form submision data must be a string, number or boolean.");
        }
        data.push({
            name: key,
            value: value,
            type: type,
        });
    }
    const formRes = await form_submissions_1.default.createSingle({
        id: undefined,
        form_key: props.form.key,
        environment_key: props.environment_key,
        data,
    });
    return formRes;
};
exports.default = submitForm;
//# sourceMappingURL=submit-form.js.map