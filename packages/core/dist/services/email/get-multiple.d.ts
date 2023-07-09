import z from "zod";
import emailsSchema from "../../schemas/email";
export interface ServiceData {
    query: z.infer<typeof emailsSchema.getMultiple.query>;
}
declare const getMultiple: (data: ServiceData) => Promise<{
    data: import("../../db/models/Email").EmailT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map