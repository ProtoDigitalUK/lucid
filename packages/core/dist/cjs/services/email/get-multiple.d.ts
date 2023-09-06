import { PoolClient } from "pg";
import z from "zod";
import emailsSchema from "../../schemas/email.js";
export interface ServiceData {
    query: z.infer<typeof emailsSchema.getMultiple.query>;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../db/models/Email.js").EmailT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map