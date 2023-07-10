import { BrickObject } from "../../db/models/CollectionBrick";
import { CollectionT } from "../collections";
import { EnvironmentResT } from "../environments";
export interface ServiceData {
    id: number;
    builder_bricks: Array<BrickObject>;
    fixed_bricks: Array<BrickObject>;
    collection: CollectionT;
    environment: EnvironmentResT;
}
declare const updateBricks: (data: ServiceData) => Promise<void>;
export default updateBricks;
//# sourceMappingURL=update-bricks.d.ts.map