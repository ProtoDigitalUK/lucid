import { PoolClient } from "pg";
export interface ServiceData {
    ids: number[];
}
declare const getMultipleByIds: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-media").MediaResT[]>;
export default getMultipleByIds;
//# sourceMappingURL=get-multiple-by-ids.d.ts.map