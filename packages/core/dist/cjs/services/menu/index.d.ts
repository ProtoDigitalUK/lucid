declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("../../utils/format/format-menu.js").MenuResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("../../db/models/Menu.js").MenuT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("../../utils/format/format-menu.js").MenuResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("../../utils/format/format-menu.js").MenuResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData) => Promise<import("../../utils/format/format-menu.js").MenuResT>;
    checkKeyUnique: (client: import("pg").PoolClient, data: import("./check-key-unique.js").ServiceData) => Promise<void>;
    getItems: (client: import("pg").PoolClient, data: import("./get-items.js").ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT[]>;
    getSingleItem: (client: import("pg").PoolClient, data: import("./get-single-item.js").ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT>;
    deleteItemsByIds: (client: import("pg").PoolClient, data: import("./delete-items-by-ids.js").ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT[]>;
    upsertMultipleItems: (client: import("pg").PoolClient, data: import("./upsert-multiple-items.js").ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT[]>;
    upsertItem: (client: import("pg").PoolClient, data: import("./upsert-item.js").ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map