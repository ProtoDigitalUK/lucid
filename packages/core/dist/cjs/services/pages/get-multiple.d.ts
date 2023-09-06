import { PoolClient } from "pg";
import z from "zod";
import pagesSchema from "../../schemas/pages.js";
export interface ServiceData {
    query: z.infer<typeof pagesSchema.getMultiple.query>;
    environment_key: string;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../db/models/Page.js").PageT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map