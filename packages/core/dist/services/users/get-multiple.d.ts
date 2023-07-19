import { PoolClient } from "pg";
import z from "zod";
import usersSchema from "../../schemas/users";
export interface ServiceData {
    query: z.infer<typeof usersSchema.getMultiple.query>;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../../../types/src/users").UserResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map