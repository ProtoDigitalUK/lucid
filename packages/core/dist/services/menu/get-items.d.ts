export interface ServiceData {
    menu_ids: number[];
}
declare const getItems: (data: ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
export default getItems;
//# sourceMappingURL=get-items.d.ts.map