import { PoolClient } from "pg";
import { BrickObject } from "../../db/models/CollectionBrick";
import { CollectionResT } from "@lucid/types/src/collections";
import { EnvironmentResT } from "@lucid/types/src/environments";
export interface ServiceData {
    id: number;
    builder_bricks: Array<BrickObject>;
    fixed_bricks: Array<BrickObject>;
    collection: CollectionResT;
    environment: EnvironmentResT;
}
declare const updateMultiple: (client: PoolClient, data: ServiceData) => Promise<void>;
export default updateMultiple;
//# sourceMappingURL=update-multiple.d.ts.map