import { PoolClient } from "pg";
import z from "zod";
import formsSchema from "../../schemas/forms.js";
export interface ServiceData {
    query: z.infer<typeof formsSchema.getAll.query>;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/forms.js").FormResT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map