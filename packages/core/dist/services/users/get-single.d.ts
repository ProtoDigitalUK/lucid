import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map