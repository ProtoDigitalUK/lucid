import { PoolClient } from "pg";
export interface ServiceData {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    super_admin?: boolean;
    role_ids?: number[];
}
declare const registerSingle: (client: PoolClient, data: ServiceData, current_user_id?: number) => Promise<import("../../utils/format/format-user").UserResT>;
export default registerSingle;
//# sourceMappingURL=register-single.d.ts.map