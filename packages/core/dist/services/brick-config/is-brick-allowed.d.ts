import { EnvironmentT } from "../../db/models/Environment";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { BrickConfigT } from "../brick-config";
import { CollectionT } from "../collections";
export interface ServiceData {
    key: string;
    collection: CollectionT;
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