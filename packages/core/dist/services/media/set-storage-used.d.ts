import { PoolClient } from "pg";
export interface ServiceData {
    add: number;
    minus?: number;
}
declare const getStorageUsed: (client: PoolClient, data: ServiceData) => Promise<number>;
export default getStorageUsed;
//# sourceMappingURL=set-storage-used.d.ts.map