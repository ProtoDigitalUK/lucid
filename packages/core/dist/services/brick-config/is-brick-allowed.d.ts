import { EnvironmentT } from "../../db/models/Environment";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { CollectionResT } from "@lucid/types/src/collections";
import { BrickConfigT } from "@lucid/types/src/bricks";
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