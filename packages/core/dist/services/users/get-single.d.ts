import { PoolClient } from "pg";
export interface ServiceData {
    user_id?: number;
    email?: string;
    username?: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../../../types/src/users").UserResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map