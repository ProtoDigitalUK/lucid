import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const getSingleById: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/media.js").MediaResT>;
export default getSingleById;
//# sourceMappingURL=get-single-by-id.d.ts.map