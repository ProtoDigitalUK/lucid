import z from "zod";
import menusSchema, { MenuItem, MenuItemUpdate } from "../../schemas/menus";
import { queryDataFormat } from "../../utils/app/query-helpers";
import { MenuRes } from "../../services/menu";
type MenuCreateSingle = (data: {
    environment_key: string;
    key: string;
    name: string;
    description?: string;
    items?: MenuItem[];
}) => Promise<MenuT>;
type MenuDeleteSingle = (data: {
    environment_key: string;
    id: number;
}) => Promise<MenuT>;
type MenuGetSingle = (data: {
    environment_key: string;
    id: number;
}) => Promise<MenuRes>;
type MenuGetMultiple = (query: z.infer<typeof menusSchema.getMultiple.query>, data: {
    environment_key: string;
}) => Promise<{
    data: MenuRes[];
    count: number;
}>;
type MenuUpdateSingle = (data: {
    environment_key: string;
    id: number;
    key?: string;
    name?: string;
    description?: string;
    items?: MenuItemUpdate[];
}) => Promise<MenuT>;
export type MenuT = {
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};
export type MenuItemT = {
    id: number;
    menu_id: number;
    parent_id: number | null;
    page_id: number | null;
    name: string;
    url: string;
    target: "_self" | "_blank" | "_parent" | "_top";
    position: number;
    meta: any;
    full_slug: string | null;
};
export default class Menu {
    static createSingle: MenuCreateSingle;
    static deleteSingle: MenuDeleteSingle;
    static getSingle: MenuGetSingle;
    static getMultiple: MenuGetMultiple;
    static updateSingle: MenuUpdateSingle;
    static checkKeyIsUnique: (key: string, environment_key: string) => Promise<MenuT>;
    static getMenuItems: (menu_ids: number[]) => Promise<MenuItemT[]>;
    static getSingleItem: (id: number, menu_id: number) => Promise<MenuItemT>;
    static deleteItemsByIds: (ids: number[]) => Promise<MenuItemT[]>;
    static updateMenuItem: (item_id: number, query_data: ReturnType<typeof queryDataFormat>) => Promise<MenuItemT>;
    static createMenuItem: (query_data: ReturnType<typeof queryDataFormat>) => Promise<MenuItemT>;
}
export {};
//# sourceMappingURL=Menu.d.ts.map