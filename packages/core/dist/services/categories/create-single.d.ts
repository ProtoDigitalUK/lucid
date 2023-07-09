export interface ServiceData {
    environment_key: string;
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
}
declare const createSingle: (data: ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map