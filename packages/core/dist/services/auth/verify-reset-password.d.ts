import { PoolClient } from "pg";
export interface ServiceData {
    token: string;
}
declare const verifyResetPassword: (client: PoolClient, data: ServiceData) => Promise<{}>;
export default verifyResetPassword;
//# sourceMappingURL=verify-reset-password.d.ts.map