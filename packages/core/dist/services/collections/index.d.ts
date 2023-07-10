import { CollectionConfigT } from "@lucid/collection-builder";
export type CollectionT = {
    key: CollectionConfigT["key"];
    title: CollectionConfigT["title"];
    singular: CollectionConfigT["singular"];
    description: CollectionConfigT["description"];
    type: CollectionConfigT["type"];
    bricks?: CollectionConfigT["bricks"];
};
declare const _default: {
    getSingle: (data: import("./get-single").ServiceData) => Promise<CollectionT>;
    getAll: (data: import("./get-all").ServiceData) => Promise<never[] | {
        getSingle: (data: import("./get-single").ServiceData) => Promise<CollectionT>;
        getAll: any;
        updateBricks: (data: import("./update-bricks").ServiceData) => Promise<void>;
        formatCollection: (instance: import("@lucid/collection-builder").default) => CollectionT;
    }>;
    updateBricks: (data: import("./update-bricks").ServiceData) => Promise<void>;
    formatCollection: (instance: import("@lucid/collection-builder").default) => CollectionT;
};
export default _default;
//# sourceMappingURL=index.d.ts.map