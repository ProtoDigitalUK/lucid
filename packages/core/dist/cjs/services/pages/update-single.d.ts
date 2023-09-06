import { PoolClient } from "pg";
import z from "zod";
import { BrickSchema } from "../../schemas/bricks.js";
export interface ServiceData {
    id: number;
    environment_key: string;
    userId: number;
    title?: string;
    slug?: string;
    homepage?: boolean;
    parent_id?: number;
    category_ids?: number[];
    published?: boolean;
    excerpt?: string;
    builder_bricks?: z.infer<typeof BrickSchema>[];
    fixed_bricks?: z.infer<typeof BrickSchema>[];
}
declare const updateSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map