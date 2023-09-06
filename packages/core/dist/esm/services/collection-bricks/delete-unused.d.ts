import { PoolClient } from "pg";
import { CollectionBrickConfigT } from "../../builders/collection-builder/index.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
export interface ServiceData {
    type: CollectionResT["type"];
    reference_id: number;
    brick_ids: Array<number | undefined>;
    brick_type: CollectionBrickConfigT["type"];
}
declare const deleteUnused: (client: PoolClient, data: ServiceData) => Promise<void>;
export default deleteUnused;
//# sourceMappingURL=delete-unused.d.ts.map