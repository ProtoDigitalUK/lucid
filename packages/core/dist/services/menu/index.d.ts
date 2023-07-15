declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/format/format-menu").MenuResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
    checkKeyUnique: (client: import("pg").PoolClient, data: import("./check-key-unique").ServiceData) => Promise<void>;
    getItems: (client: import("pg").PoolClient, data: import("./get-items").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    getSingleItem: (client: import("pg").PoolClient, data: import("./get-single-item").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT>;
    deleteItemsByIds: (client: import("pg").PoolClient, data: import("./delete-items-by-ids").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    upsertMultipleItems: (client: import("pg").PoolClient, data: import("./upsert-multiple-items").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    upsertItem: (client: import("pg").PoolClient, data: import("./upsert-item").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map