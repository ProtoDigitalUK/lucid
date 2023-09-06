import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
    environment_key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/forms").FormResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map