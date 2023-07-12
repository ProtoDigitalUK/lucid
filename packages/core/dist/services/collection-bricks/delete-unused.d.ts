import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { CollectionResT } from "../../utils/format/format-collections";
export interface ServiceData {
    type: CollectionResT["type"];
    reference_id: number;
    brick_ids: Array<number | undefined>;
    brick_type: CollectionBrickConfigT["type"];
}
declare const deleteUnused: (data: ServiceData) => Promise<void>;
export default deleteUnused;
//# sourceMappingURL=delete-unused.d.ts.map