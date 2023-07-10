export interface ServiceData {
    id?: number;
    form_key: string;
    environment_key: string;
    data: Array<{
        name: string;
        type: "string" | "number" | "boolean";
        value: string | number | boolean;
    }>;
}
declare const createSingle: (data: ServiceData) => Promise<import("../form-submissions").FormSubmissionResT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map