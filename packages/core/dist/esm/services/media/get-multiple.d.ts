import { PoolClient } from "pg";
import z from "zod";
import mediaSchema from "../../schemas/media.js";
export interface ServiceData {
    query: z.infer<typeof mediaSchema.getMultiple.query>;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("@lucid/types/src/media.js").MediaResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map