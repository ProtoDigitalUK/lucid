import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
    data: {
        from_address?: string;
        from_name?: string;
        delivery_status?: "sent" | "failed" | "pending";
    };
}
declare const updatteSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Email.js").EmailT>;
export default updatteSingle;
//# sourceMappingURL=update-single.d.ts.map