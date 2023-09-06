import { PoolClient } from "pg";
import { MenuItem } from "../../schemas/menus.js";
export interface ServiceData {
    environment_key: string;
    key: string;
    name: string;
    description?: string;
    items?: MenuItem[];
}
declare const createSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-menu.js").MenuResT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map