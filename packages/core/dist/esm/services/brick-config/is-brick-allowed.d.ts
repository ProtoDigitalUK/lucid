import { EnvironmentT } from "../../db/models/Environment.js";
import { CollectionBrickConfigT } from "../../builders/collection-builder/index.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
import { BrickConfigT } from "@lucid/types/src/bricks.js";
export interface ServiceData {
    key: string;
    collection: CollectionResT;
    environment: EnvironmentT;
    type?: CollectionBrickConfigT["type"];
}
declare const isBrickAllowed: (data: ServiceData) => {
    allowed: boolean;
    brick: BrickConfigT | undefined;
    collectionBrick: {
        builder: CollectionBrickConfigT | undefined;
        fixed: CollectionBrickConfigT | undefined;
    };
};
export default isBrickAllowed;
//# sourceMappingURL=is-brick-allowed.d.ts.map