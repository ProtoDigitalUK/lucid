import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const deleteSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map