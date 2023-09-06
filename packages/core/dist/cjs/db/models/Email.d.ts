import { PoolClient } from "pg";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
type EmailCreateSingle = (client: PoolClient, data: {
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
}) => Promise<EmailT>;
type EmailGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: EmailT[];
    count: number;
}>;
type EmailUpdateSingle = (client: PoolClient, data: {
    id: number;
    from_address?: string;
    from_name?: string;
    delivery_status?: "sent" | "failed" | "pending";
}) => Promise<EmailT>;
type EmailGetSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<EmailT>;
type EmailDeleteSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<EmailT>;
export type EmailT = {
    id: number;
    from_address: string | null;
    from_name: string | null;
    to_address: string | null;
    subject: string | null;
    cc: string | null;
    bcc: string | null;
    delivery_status: "sent" | "failed" | "pending";
    template: string;
    data?: {
        [key: string]: any;
    };
    created_at: string;
    updated_at: string;
    html?: string;
};
export default class Email {
    static createSingle: EmailCreateSingle;
    static getMultiple: EmailGetMultiple;
    static getSingle: EmailGetSingle;
    static deleteSingle: EmailDeleteSingle;
    static updateSingle: EmailUpdateSingle;
}
export {};
//# sourceMappingURL=Email.d.ts.map