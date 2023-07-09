export interface ServiceData {
    key: string;
    environment_key: string;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../db/models/Form").FormT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map