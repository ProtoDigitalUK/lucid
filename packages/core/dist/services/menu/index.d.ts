export interface ItemsRes {
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
declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<{
        id: number;
        key: string;
        environment_key: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        items: ItemsRes[] | null;
    }>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: {
            id: number;
            key: string;
            environment_key: string;
            name: string;
            description: string;
            created_at: string;
            updated_at: string;
            items: ItemsRes[] | null;
        }[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<{
        id: number;
        key: string;
        environment_key: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        items: ItemsRes[] | null;
    }>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<{
        id: number;
        key: string;
        environment_key: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        items: ItemsRes[] | null;
    }>;
    checkKeyUnique: (data: import("./check-key-unique").ServiceData) => Promise<void>;
    getItems: (data: import("./get-items").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    getSingleItem: (data: import("./get-single-item").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT>;
    deleteItemsByIds: (data: import("./delete-items-by-ids").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    format: (menu: import("../../db/models/Menu").MenuT, items: import("../../db/models/Menu").MenuItemT[]) => {
        id: number;
        key: string;
        environment_key: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        items: ItemsRes[] | null;
    };
    upsertMultipleItems: (data: import("./upsert-multiple-items").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    upsertItem: (data: import("./upsert-item").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map