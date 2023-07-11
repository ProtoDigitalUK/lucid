export interface ServiceData {
    id: number;
    menu_id: number;
}
declare const getSingleItem: (data: ServiceData) => Promise<import("../../db/models/Menu").MenuItemT>;
export default getSingleItem;
//# sourceMappingURL=get-single-item.d.ts.map