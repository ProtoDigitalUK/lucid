import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    password?: string;
    role_ids?: number[];
    super_admin?: boolean;
}
declare const updateSingle: (client: PoolClient, data: ServiceData, current_user_id?: number) => Promise<import("@lucid/types/src/users").UserResT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map