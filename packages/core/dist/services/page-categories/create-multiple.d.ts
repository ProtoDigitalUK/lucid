export interface ServiceData {
    page_id: number;
    category_ids: Array<number>;
    collection_key: string;
}
declare const createMultiple: (data: ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
export default createMultiple;
//# sourceMappingURL=create-multiple.d.ts.map