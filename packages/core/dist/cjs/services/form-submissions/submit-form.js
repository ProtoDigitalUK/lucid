"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFormExternal = void 0;
const db_js_1 = require("../../db/db.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../form-submissions/index.js"));
const submitForm = async (client, props) => {
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
    const formRes = await (0, service_js_1.default)(index_js_1.default.createSingle, false, client)({
        id: undefined,
        form_key: props.form.key,
        environment_key: props.environment_key,
        data,
    });
    return formRes;
};
const submitFormExternal = async (props) => {
    const client = await (0, db_js_1.getDBClient)();
    try {
        await client.query("BEGIN");
        await submitForm(client, props);
        await client.query("COMMIT");
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.submitFormExternal = submitFormExternal;
exports.default = submitForm;
//# sourceMappingURL=submit-form.js.map