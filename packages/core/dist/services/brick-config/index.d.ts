declare const _default: {
    getAll: (client: import("pg").PoolClient, data: import("./get-all").ServiceData) => Promise<import("@lucid/types/src/bricks").BrickConfigT[]>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("@lucid/types/src/bricks").BrickConfigT>;
    getBrickConfig: () => import("@lucid/brick-builder").default[];
    isBrickAllowed: (data: import("./is-brick-allowed").ServiceData) => {
        allowed: boolean;
        brick: import("@lucid/types/src/bricks").BrickConfigT | undefined;
        collectionBrick: {
            builder: import("@lucid/collection-builder").CollectionBrickConfigT | undefined;
            fixed: import("@lucid/collection-builder").CollectionBrickConfigT | undefined;
        };
    };
    getBrickData: (instance: import("@lucid/brick-builder").default, query?: {
        include?: "fields"[] | undefined;
        filter?: {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined;
    } | undefined) => import("@lucid/types/src/bricks").BrickConfigT;
    getAllAllowedBricks: (data: import("./get-all-allowed-bricks").ServiceData) => {
        bricks: import("@lucid/types/src/bricks").BrickConfigT[];
        collectionBricks: import("@lucid/collection-builder").CollectionBrickConfigT[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map