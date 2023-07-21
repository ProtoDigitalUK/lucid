import { PoolClient } from "pg";
export interface ServiceData {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    super_admin?: boolean;
    role_ids?: number[];
    reset_password?: boolean;
}
declare const registerSingle: (client: PoolClient, data: ServiceData, current_user_id?: number) => Promise<import("../../../../types/src/users").UserResT>;
export default registerSingle;
//# sourceMappingURL=register-single.d.ts.map