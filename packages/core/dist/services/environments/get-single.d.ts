import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map