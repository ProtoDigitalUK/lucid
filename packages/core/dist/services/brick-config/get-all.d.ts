import { PoolClient } from "pg";
import z from "zod";
import bricksSchema from "../../schemas/bricks";
import { BrickConfigT } from "@lucid/types/src/bricks";
export interface ServiceData {
    query: z.infer<typeof bricksSchema.config.getAll.query>;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<BrickConfigT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map