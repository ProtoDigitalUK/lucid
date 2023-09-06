import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import environmentsService from "../environments/index.js";
const hasEnvironmentPermission = async (client, data) => {
    const environment = await service(environmentsService.getSingle, false, client)({
        key: data.environment_key,
    });
    const hasPerm = environment.assigned_forms?.includes(data.form_key);
    if (!hasPerm) {
        throw new LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form is not assigned to this environment.",
            status: 403,
        });
    }
    return environment;
};
export default hasEnvironmentPermission;
//# sourceMappingURL=has-environment-permission.js.map