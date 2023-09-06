import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
}
declare const resendSingle: (client: PoolClient, data: ServiceData) => Promise<{
    status: {
        success: boolean;
        message: string;
    };
    email: import("../../db/models/Email.js").EmailT;
}>;
export default resendSingle;
//# sourceMappingURL=resend-single.d.ts.map