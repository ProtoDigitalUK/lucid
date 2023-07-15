import { PoolClient } from "pg";
export interface ServiceData {
    from_address?: string;
    from_name?: string;
    to_address?: string;
    subject?: string;
    cc?: string;
    bcc?: string;
    template: string;
    delivery_status: "sent" | "failed" | "pending";
    data?: {
        [key: string]: any;
    };
}
declare const createSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Email").EmailT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map