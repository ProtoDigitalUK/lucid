import service from "../../utils/app/service.js";
import Config from "../Config.js";
import environmentsService from "../environments/index.js";
import formatForm from "../../utils/format/format-form.js";
const getAll = async (client, data) => {
    const formInstances = Config.forms || [];
    let formsRes = formInstances.map((form) => formatForm(form));
    if (data.query.filter?.environment_key) {
        const environment = await service(environmentsService.getSingle, false, client)({
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
export default getAll;
//# sourceMappingURL=get-all.js.map