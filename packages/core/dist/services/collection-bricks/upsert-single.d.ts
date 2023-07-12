import { BrickObject } from "../../db/models/CollectionBrick";
import { EnvironmentT } from "../../db/models/Environment";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { CollectionResT } from "../../utils/format/format-collections";
export interface ServiceData {
    reference_id: number;
    brick: BrickObject;
    brick_type: CollectionBrickConfigT["type"];
    order: number;
    environment: EnvironmentT;
    collection: CollectionResT;
}
declare const upsertSingleWithFields: (data: ServiceData) => Promise<number>;
export default upsertSingleWithFields;
//# sourceMappingURL=upsert-single.d.ts.map