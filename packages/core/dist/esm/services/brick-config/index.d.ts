declare const _default: {
    getAll: (client: import("pg").PoolClient, data: import("./get-all.js").ServiceData) => Promise<import("@lucid/types/src/bricks.js").BrickConfigT[]>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("@lucid/types/src/bricks.js").BrickConfigT>;
    getBrickConfig: () => import("../../index.js").BrickBuilder[];
    isBrickAllowed: (data: import("./is-brick-allowed.js").ServiceData) => {
        allowed: boolean;
        brick: import("@lucid/types/src/bricks.js").BrickConfigT | undefined;
        collectionBrick: {
            builder: import("../../builders/collection-builder/index.js").CollectionBrickConfigT | undefined;
            fixed: import("../../builders/collection-builder/index.js").CollectionBrickConfigT | undefined;
        };
    };
    getBrickData: (instance: import("../../index.js").BrickBuilder, query?: {
        include?: "fields"[] | undefined;
        filter?: {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined;
    } | undefined) => import("@lucid/types/src/bricks.js").BrickConfigT;
    getAllAllowedBricks: (data: import("./get-all-allowed-bricks.js").ServiceData) => {
        bricks: import("@lucid/types/src/bricks.js").BrickConfigT[];
        collectionBricks: import("../../builders/collection-builder/index.js").CollectionBrickConfigT[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map