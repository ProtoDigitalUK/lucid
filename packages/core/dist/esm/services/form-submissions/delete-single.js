import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import FormSubmission from "../../db/models/FormSubmission.js";
import formSubService from "../form-submissions/index.js";
import formsService from "../forms/index.js";
import formatFormSubmission from "../../utils/format/format-form-submission.js";
const deleteSingle = async (client, data) => {
    await service(formSubService.hasEnvironmentPermission, false, client)({
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const formSubmission = await FormSubmission.deleteSingle(client, {
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    if (!formSubmission) {
        throw new LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    const formBuilder = formsService.getBuilderInstance({
        form_key: data.form_key,
    });
    return formatFormSubmission(formBuilder, {
        submission: formSubmission,
        data: [],
    });
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map