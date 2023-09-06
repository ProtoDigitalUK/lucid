import { PoolClient } from "pg";
import { BrickObject } from "../../db/models/CollectionBrick.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
import { EnvironmentResT } from "@lucid/types/src/environments.js";
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