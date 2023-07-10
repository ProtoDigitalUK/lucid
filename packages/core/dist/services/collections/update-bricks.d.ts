import { BrickObject } from "../../db/models/CollectionBrick";
import { EnvironmentResT } from "../../utils/environments/format-environment";
import { CollectionT } from "../collections";
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