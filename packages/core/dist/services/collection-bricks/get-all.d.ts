import { PoolClient } from "pg";
import { CollectionResT } from "@lucid/types/src/collections";
export interface ServiceData {
    reference_id: number;
    type: CollectionResT["type"];
    environment_key: string;
    collection: CollectionResT;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<{
    builder_bricks: import("../../utils/format/format-bricks").BrickResT[];
    fixed_bricks: import("../../utils/format/format-bricks").BrickResT[];
}>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map