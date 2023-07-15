import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    password?: string;
    role_ids?: number[];
}
declare const updateSingle: (client: PoolClient, data: ServiceData) => Promise<void>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map