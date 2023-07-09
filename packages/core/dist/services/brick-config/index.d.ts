import { CustomField, BrickConfigOptionsT } from "@lucid/brick-builder";
export type BrickConfigT = {
    key: string;
    title: string;
    fields?: CustomField[];
    preview?: BrickConfigOptionsT["preview"];
};
declare const _default: {
    getAll: (data: import("./get-all").ServiceData) => Promise<BrickConfigT[]>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<BrickConfigT>;
    getBrickConfig: () => import("@lucid/brick-builder").default[];
    isBrickAllowed: (data: import("./is-brick-allowed").ServiceData) => {
        allowed: boolean;
        brick: BrickConfigT | undefined;
        collectionBrick: {
            builder: import("../../../../collection-builder/src").CollectionBrickConfigT | undefined;
            fixed: import("../../../../collection-builder/src").CollectionBrickConfigT | undefined;
        };
    };
    getBrickData: (instance: import("@lucid/brick-builder").default, query?: {
        include?: "fields"[] | undefined;
    } | undefined) => BrickConfigT;
    getAllAllowedBricks: (data: import("./get-all-allowed-bricks").ServiceData) => {
        bricks: BrickConfigT[];
        collectionBricks: import("../../../../collection-builder/src").CollectionBrickConfigT[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map