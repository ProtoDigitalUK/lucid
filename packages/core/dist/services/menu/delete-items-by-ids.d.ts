export interface ServiceData {
    ids: number[];
}
declare const deleteItemsByIds: (data: ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
export default deleteItemsByIds;
//# sourceMappingURL=delete-items-by-ids.d.ts.map