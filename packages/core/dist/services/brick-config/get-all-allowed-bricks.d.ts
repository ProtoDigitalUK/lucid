import { EnvironmentT } from "../../db/models/Environment";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { BrickConfigT } from "../brick-config";
import { CollectionT } from "../collections";
export interface ServiceData {
    collection: CollectionT;
    environment: EnvironmentT;
}
declare const getAllAllowedBricks: (data: ServiceData) => {
    bricks: BrickConfigT[];
    collectionBricks: CollectionBrickConfigT[];
};
export default getAllAllowedBricks;
//# sourceMappingURL=get-all-allowed-bricks.d.ts.map