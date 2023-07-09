import z from "zod";
import bricksSchema from "../../schemas/bricks";
export interface ServiceData {
    query: z.infer<typeof bricksSchema.config.getAll.query>;
    collection_key: string;
    environment_key: string;
}
declare const getAll: (data: ServiceData) => Promise<import("../brick-config").BrickConfigT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map