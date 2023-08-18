import { PoolClient } from "pg";
import z from "zod";
import formsSchema from "../../schemas/forms";
export interface ServiceData {
    query: z.infer<typeof formsSchema.getAll.query>;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/forms").FormResT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map