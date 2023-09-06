import { PoolClient } from "pg";
import z from "zod";
import rolesSchema from "../../schemas/roles.js";
export interface ServiceData {
    query: z.infer<typeof rolesSchema.getMultiple.query>;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("@lucid/types/src/roles").RoleResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map