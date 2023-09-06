import { PoolClient } from "pg";
export interface ServiceData {
    current: number;
    environment_key: string;
}
declare const resetHomepages: (client: PoolClient, data: ServiceData) => Promise<void>;
export default resetHomepages;
//# sourceMappingURL=reset-homepages.d.ts.map