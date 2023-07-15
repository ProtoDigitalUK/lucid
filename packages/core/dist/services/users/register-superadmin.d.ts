import { PoolClient } from "pg";
export interface ServiceData {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
}
declare const registerSuperAdmin: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
export default registerSuperAdmin;
//# sourceMappingURL=register-superadmin.d.ts.map