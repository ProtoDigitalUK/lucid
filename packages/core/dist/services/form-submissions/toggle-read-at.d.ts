export interface ServiceData {
    id: number;
    form_key: string;
    environment_key: string;
}
declare const toggleReadAt: (data: ServiceData) => Promise<import("../../utils/forms/format-form").FormSubmissionResT>;
export default toggleReadAt;
//# sourceMappingURL=toggle-read-at.d.ts.map