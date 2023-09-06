import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import FormSubmission from "../../db/models/FormSubmission.js";
import formSubService from "../form-submissions/index.js";
import formsService from "../forms/index.js";
import formatFormSubmission from "../../utils/format/format-form-submission.js";
const toggleReadAt = async (client, data) => {
    await service(formSubService.hasEnvironmentPermission, false, client)({
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const formSubmission = await service(formSubService.getSingle, false, client)({
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const updateFormSubmission = await FormSubmission.toggleReadAt(client, {
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
        read_at: formSubmission.read_at ? null : new Date(),
    });
    if (!updateFormSubmission) {
        throw new LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    let formData = await FormSubmission.getAllFormData(client, {
        submission_ids: [updateFormSubmission.id],
    });
    formData = formData.filter((field) => field.form_submission_id === updateFormSubmission.id);
    const formBuilder = formsService.getBuilderInstance({
        form_key: updateFormSubmission.form_key,
    });
    return formatFormSubmission(formBuilder, {
        submission: updateFormSubmission,
        data: formData,
    });
};
export default toggleReadAt;
//# sourceMappingURL=toggle-read-at.js.map