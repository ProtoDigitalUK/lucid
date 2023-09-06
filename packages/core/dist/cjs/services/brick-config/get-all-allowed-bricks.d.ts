import { EnvironmentT } from "../../db/models/Environment.js";
import { CollectionBrickConfigT } from "../../builders/collection-builder/index.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
import { BrickConfigT } from "@lucid/types/src/bricks.js";
export interface ServiceData {
    collection: CollectionResT;
    environment: EnvironmentT;
}
declare const getAllAllowedBricks: (data: ServiceData) => {
    bricks: BrickConfigT[];
    collectionBricks: CollectionBrickConfigT[];
};
export default getAllAllowedBricks;
//# sourceMappingURL=get-all-allowed-bricks.d.ts.map