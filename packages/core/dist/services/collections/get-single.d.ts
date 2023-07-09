export interface ServiceData {
    collection_key: string;
    environment_key: string;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../db/models/Collection").CollectionT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map