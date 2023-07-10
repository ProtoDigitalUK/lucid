export interface ServiceData {
    id: number;
    data: {
        from_address?: string;
        from_name?: string;
        delivery_status?: "sent" | "failed" | "pending";
    };
}
declare const updatteSingle: (data: ServiceData) => Promise<import("../../db/models/Email").EmailT>;
export default updatteSingle;
//# sourceMappingURL=update-single.d.ts.map