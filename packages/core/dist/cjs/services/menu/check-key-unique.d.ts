import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
    environment_key: string;
}
declare const checkKeyUnique: (client: PoolClient, data: ServiceData) => Promise<void>;
export default checkKeyUnique;
//# sourceMappingURL=check-key-unique.d.ts.map