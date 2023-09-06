import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
    form_key: string;
    environment_key: string;
}
declare const deleteSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-form-submission.js").FormSubmissionResT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map