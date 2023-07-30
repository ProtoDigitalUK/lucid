declare const _default: {
    getAll: (client: import("pg").PoolClient, data: import("./get-all").ServiceData) => Promise<import("../../../../types/src/bricks").BrickConfigT[]>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../../../types/src/bricks").BrickConfigT>;
    getBrickConfig: () => import("../../../../brick-builder/src").default[];
    isBrickAllowed: (data: import("./is-brick-allowed").ServiceData) => {
        allowed: boolean;
        brick: import("../../../../types/src/bricks").BrickConfigT | undefined;
        collectionBrick: {
            builder: import("../../../../collection-builder/src").CollectionBrickConfigT | undefined;
            fixed: import("../../../../collection-builder/src").CollectionBrickConfigT | undefined;
        };
    };
    getBrickData: (instance: import("../../../../brick-builder/src").default, query?: {
        include?: "fields"[] | undefined;
        filter?: {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined;
    } | undefined) => import("../../../../types/src/bricks").BrickConfigT;
    getAllAllowedBricks: (data: import("./get-all-allowed-bricks").ServiceData) => {
        bricks: import("../../../../types/src/bricks").BrickConfigT[];
        collectionBricks: import("../../../../collection-builder/src").CollectionBrickConfigT[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map