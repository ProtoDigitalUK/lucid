import { PoolClient } from "pg";
import z from "zod";
import formSubmissionsSchema from "../../schemas/form-submissions";
export interface ServiceData {
    query: z.infer<typeof formSubmissionsSchema.getMultiple.query>;
    form_key: string;
    environment_key: string;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../utils/format/format-form-submission").FormSubmissionResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map