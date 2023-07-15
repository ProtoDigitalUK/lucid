import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
    password: string;
}
declare const updatePassword: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
export default updatePassword;
//# sourceMappingURL=update-password.d.ts.map