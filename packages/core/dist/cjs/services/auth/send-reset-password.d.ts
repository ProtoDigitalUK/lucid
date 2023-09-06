import { PoolClient } from "pg";
export interface ServiceData {
    email: string;
}
declare const sendResetPassword: (client: PoolClient, data: ServiceData) => Promise<{
    message: string;
}>;
export default sendResetPassword;
//# sourceMappingURL=send-reset-password.d.ts.map