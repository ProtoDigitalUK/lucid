import { PoolClient } from "pg";
import { BrickFieldObject } from "../../db/models/CollectionBrick";
export interface ServiceData {
    brick_id: number;
    data: BrickFieldObject;
}
declare const upsertRepeater: (client: PoolClient, data: ServiceData) => Promise<void>;
export default upsertRepeater;
//# sourceMappingURL=upsert-repeater.d.ts.map