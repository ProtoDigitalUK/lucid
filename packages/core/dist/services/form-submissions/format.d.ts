import { FormDataT, FormSubmissionsT } from "../../db/models/FormSubmission";
import { FormSubmissionResT } from "../form-submissions";
import FormBuilder from "@lucid/form-builder";
declare const formatFormSubmission: (form: FormBuilder, data: {
    submission: FormSubmissionsT;
    data: FormDataT[];
}) => FormSubmissionResT;
export default formatFormSubmission;
//# sourceMappingURL=format.d.ts.map