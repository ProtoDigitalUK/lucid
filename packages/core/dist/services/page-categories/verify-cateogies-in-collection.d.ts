export interface ServiceData {
    category_ids: Array<number>;
    collection_key: string;
}
declare const verifyCategoriesInCollection: (data: ServiceData) => Promise<{
    id: number;
}[]>;
export default verifyCategoriesInCollection;
//# sourceMappingURL=verify-cateogies-in-collection.d.ts.map