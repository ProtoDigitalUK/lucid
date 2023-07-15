import { PoolClient } from "pg";
import z from "zod";
import pagesSchema from "../../schemas/pages";
export interface ServiceData {
    query: z.infer<typeof pagesSchema.getMultiple.query>;
    environment_key: string;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../db/models/Page").PageT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map