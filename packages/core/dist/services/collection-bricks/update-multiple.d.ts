import { BrickObject } from "../../db/models/CollectionBrick";
import { CollectionResT } from "../../utils/format/format-collections";
import { EnvironmentResT } from "../../utils/format/format-environment";
export interface ServiceData {
    id: number;
    builder_bricks: Array<BrickObject>;
    fixed_bricks: Array<BrickObject>;
    collection: CollectionResT;
    environment: EnvironmentResT;
}
declare const updateMultiple: (data: ServiceData) => Promise<void>;
export default updateMultiple;
//# sourceMappingURL=update-multiple.d.ts.map