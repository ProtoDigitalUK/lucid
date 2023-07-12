import { MenuT, MenuItemT } from "../../db/models/Menu";
export interface ItemsResT {
    page_id: number | null;
    name: string;
    url: string;
    target: "_self" | "_blank" | "_parent" | "_top";
    meta: any;
    children?: ItemsResT[];
}
export interface MenuResT {
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: ItemsResT[] | null;
}
declare const formatMenu: (menu: MenuT, items: MenuItemT[]) => MenuResT;
export default formatMenu;
//# sourceMappingURL=format-menu.d.ts.map