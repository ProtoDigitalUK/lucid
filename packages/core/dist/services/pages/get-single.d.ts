import { PoolClient } from "pg";
import z from "zod";
import pagesSchema from "../../schemas/pages";
export interface ServiceData {
    query: z.infer<typeof pagesSchema.getSingle.query>;
    environment_key: string;
    id: number;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Page").PageT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map