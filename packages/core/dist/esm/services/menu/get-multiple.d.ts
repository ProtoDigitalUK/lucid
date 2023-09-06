import { PoolClient } from "pg";
import z from "zod";
import menusSchema from "../../schemas/menus.js";
export interface ServiceData {
    query: z.infer<typeof menusSchema.getMultiple.query>;
    environment_key: string;
}
declare const getMultiple: (client: PoolClient, data: ServiceData) => Promise<{
    data: import("../../utils/format/format-menu.js").MenuResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map