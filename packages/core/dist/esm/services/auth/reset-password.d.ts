import { PoolClient } from "pg";
export interface ServiceData {
    token: string;
    password: string;
}
declare const resetPassword: (client: PoolClient, data: ServiceData) => Promise<{
    message: string;
}>;
export default resetPassword;
//# sourceMappingURL=reset-password.d.ts.map