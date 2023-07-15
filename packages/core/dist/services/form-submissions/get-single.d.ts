import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
    form_key: string;
    environment_key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map