import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import FormSubmission from "../../db/models/FormSubmission.js";
import formSubService from "../form-submissions/index.js";
import formsService from "../forms/index.js";
import formatFormSubmission from "../../utils/format/format-form-submission.js";
const createSingle = async (client, data) => {
    await service(formSubService.hasEnvironmentPermission, false, client)(data);
    const formBuilder = formsService.getBuilderInstance({
        form_key: data.form_key,
    });
    const formSubmission = await FormSubmission.createSingle(client, {
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    if (!formSubmission) {
        throw new LucidError({
            type: "basic",
            name: "Form Submission Error",
            message: "Failed to create form submission entry.",
            status: 500,
        });
    }
    const formData = await Promise.all(data.data.map((field) => FormSubmission.createFormData(client, {
        form_submission_id: formSubmission.id,
        name: field.name,
        type: field.type,
        value: field.value,
    })));
    return formatFormSubmission(formBuilder, {
        submission: formSubmission,
        data: formData,
    });
};
export default createSingle;
//# sourceMappingURL=create-single.js.map