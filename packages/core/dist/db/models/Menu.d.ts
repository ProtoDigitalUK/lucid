import { PoolClient } from "pg";
import { queryDataFormat, SelectQueryBuilder } from "../../utils/app/query-helpers";
type MenuCreateSingle = (client: PoolClient, data: {
    environment_key: string;
    key: string;
    name: string;
    description?: string;
}) => Promise<MenuT>;
type MenuDeleteSingle = (client: PoolClient, data: {
    environment_key: string;
    id: number;
}) => Promise<MenuT>;
type MenuGetSingle = (client: PoolClient, data: {
    environment_key: string;
    id: number;
}) => Promise<MenuT>;
type MenuGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: MenuT[];
    count: number;
}>;
type MenuUpdateSingle = (client: PoolClient, data: {
    environment_key: string;
    id: number;
    key?: string;
    name?: string;
    description?: string;
}) => Promise<MenuT>;
type MenuCheckKeyIsUnique = (client: PoolClient, data: {
    key: string;
    environment_key: string;
}) => Promise<MenuT>;
type MenuGetMenuItems = (client: PoolClient, data: {
    menu_ids: number[];
}) => Promise<MenuItemT[]>;
type MenuGetSingleItem = (client: PoolClient, data: {
    id: number;
    menu_id: number;
}) => Promise<MenuItemT>;
type MenuDeleteItemsByIds = (client: PoolClient, data: {
    ids: number[];
}) => Promise<MenuItemT[]>;
type MenuUpdateMenuItem = (client: PoolClient, data: {
    item_id: number;
    query_data: ReturnType<typeof queryDataFormat>;
}) => Promise<MenuItemT>;
type MenuCreateMenuItem = (client: PoolClient, data: {
    query_data: ReturnType<typeof queryDataFormat>;
}) => Promise<MenuItemT>;
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
    static checkKeyIsUnique: MenuCheckKeyIsUnique;
    static getMenuItems: MenuGetMenuItems;
    static getSingleItem: MenuGetSingleItem;
    static deleteItemsByIds: MenuDeleteItemsByIds;
    static updateMenuItem: MenuUpdateMenuItem;
    static createMenuItem: MenuCreateMenuItem;
}
export {};
//# sourceMappingURL=Menu.d.ts.map