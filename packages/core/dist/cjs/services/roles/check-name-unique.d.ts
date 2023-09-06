import { PoolClient } from "pg";
export interface ServiceData {
    name: string;
}
declare const checkNameIsUnique: (client: PoolClient, data: ServiceData) => Promise<never>;
export default checkNameIsUnique;
//# sourceMappingURL=check-name-unique.d.ts.map