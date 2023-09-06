import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const checkKeyExists: (client: PoolClient, data: ServiceData) => Promise<void>;
export default checkKeyExists;
//# sourceMappingURL=check-key-exists.d.ts.map