export interface ServiceData {
    environment_key: string;
    collection_key: string;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../db/models/SinglePage").SinglePageT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map