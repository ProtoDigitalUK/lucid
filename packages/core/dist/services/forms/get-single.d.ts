export interface ServiceData {
    key: string;
    environment_key: string;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../utils/format/format-form").FormResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map