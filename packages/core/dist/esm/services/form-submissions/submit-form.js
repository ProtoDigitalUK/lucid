import { getDBClient } from "../../db/db.js";
import service from "../../utils/app/service.js";
import formSubService from "../form-submissions/index.js";
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
    const formRes = await service(formSubService.createSingle, false, client)({
        id: undefined,
        form_key: props.form.key,
        environment_key: props.environment_key,
        data,
    });
    return formRes;
};
export const submitFormExternal = async (props) => {
    const client = await getDBClient();
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
export default submitForm;
//# sourceMappingURL=submit-form.js.map