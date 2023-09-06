import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
    environment_key: string;
}
declare const deleteSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map