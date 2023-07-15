import { PoolClient } from "pg";
import z from "zod";
import categorySchema from "../../schemas/categories";
export interface ServiceData {
    environment_key: string;
    query: z.infer<typeof categorySchema.getMultiple.query>;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../db/models/Category").CategoryT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map