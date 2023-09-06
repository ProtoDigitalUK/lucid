import { PoolClient } from "pg";
import { BrickObject } from "../../db/models/CollectionBrick.js";
import { EnvironmentT } from "../../db/models/Environment.js";
import { CollectionBrickConfigT } from "../../builders/collection-builder/index.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
export interface ServiceData {
    reference_id: number;
    brick: BrickObject;
    brick_type: CollectionBrickConfigT["type"];
    order: number;
    environment: EnvironmentT;
    collection: CollectionResT;
}
declare const upsertSingleWithFields: (client: PoolClient, data: ServiceData) => Promise<number>;
export default upsertSingleWithFields;
//# sourceMappingURL=upsert-single.d.ts.map