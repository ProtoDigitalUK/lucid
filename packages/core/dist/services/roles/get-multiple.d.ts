import { PoolClient } from "pg";
import z from "zod";
import rolesSchema from "../../schemas/roles";
export interface ServiceData {
    query: z.infer<typeof rolesSchema.getMultiple.query>;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../db/models/Role").RoleT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map