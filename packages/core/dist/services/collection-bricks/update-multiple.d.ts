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
declare const updateMultiple: (data: ServiceData) => Promise<void>;
export default updateMultiple;
//# sourceMappingURL=update-multiple.d.ts.map