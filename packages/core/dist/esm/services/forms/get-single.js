import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Config from "../Config.js";
import environmentsService from "../environments/index.js";
import formatForm from "../../utils/format/format-form.js";
const getSingle = async (client, data) => {
    const formInstances = Config.forms || [];
    const environment = await service(environmentsService.getSingle, false, client)({
        key: data.environment_key,
    });
    const allForms = formInstances.map((form) => formatForm(form));
    const assignedForms = environment.assigned_forms || [];
    const formData = allForms.find((c) => {
        return c.key === data.key && assignedForms.includes(c.key);
    });
    if (!formData) {
        throw new LucidError({
            type: "basic",
            name: "Form not found",
            message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    return formData;
};
export default getSingle;
//# sourceMappingURL=get-single.js.map