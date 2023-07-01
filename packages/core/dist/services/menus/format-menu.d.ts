import { MenuT, MenuItemT } from "../../db/models/Menu";
interface ItemsRes {
    page_id: number | null;
    name: string;
    url: string;
    target: "_self" | "_blank" | "_parent" | "_top";
    meta: any;
    children?: ItemsRes[];
}
export interface MenuRes {
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: ItemsRes[] | null;
}
declare const formatMenu: (menu: MenuT, items: MenuItemT[]) => {
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: ItemsRes[] | null;
};
export default formatMenu;
//# sourceMappingURL=format-menu.d.ts.map