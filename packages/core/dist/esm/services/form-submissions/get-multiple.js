import FormSubmission from "../../db/models/FormSubmission.js";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import service from "../../utils/app/service.js";
import formSubService from "../form-submissions/index.js";
import formsService from "../forms/index.js";
import formatFormSubmission from "../../utils/format/format-form-submission.js";
const getMultiple = async (client, data) => {
    await service(formSubService.hasEnvironmentPermission, false, client)(data);
    const { sort, include, page, per_page } = data.query;
    const SelectQuery = new SelectQueryBuilder({
        columns: [
            "id",
            "form_key",
            "environment_key",
            "read_at",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: {
                environment_key: data.environment_key,
                form_key: data.form_key,
            },
            meta: {
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                form_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const formSubmissionsRes = await FormSubmission.getMultiple(client, SelectQuery);
    const formBuilder = formsService.getBuilderInstance({
        form_key: data.form_key,
    });
    let formData = [];
    if (include?.includes("fields")) {
        const formSubmissionIds = formSubmissionsRes.data.map((submission) => submission.id);
        formData = await FormSubmission.getAllFormData(client, {
            submission_ids: formSubmissionIds,
        });
    }
    const formattedSubmissions = formSubmissionsRes.data.map((submission) => {
        return formatFormSubmission(formBuilder, {
            submission,
            data: formData.filter((field) => field.form_submission_id === submission.id),
        });
    });
    return {
        data: formattedSubmissions,
        count: formSubmissionsRes.count,
    };
};
export default getMultiple;
//# sourceMappingURL=get-multiple.js.map