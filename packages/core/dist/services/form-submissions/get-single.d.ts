export interface ServiceData {
    id: number;
    form_key: string;
    environment_key: string;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map