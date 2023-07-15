import { PoolClient } from "pg";
import z from "zod";
import { BrickSchema } from "../../schemas/bricks";
export interface ServiceData {
    environment_key: string;
    collection_key: string;
    user_id: number;
    builder_bricks?: z.infer<typeof BrickSchema>[];
    fixed_bricks?: z.infer<typeof BrickSchema>[];
}
declare const updateSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/SinglePage").SinglePageT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map