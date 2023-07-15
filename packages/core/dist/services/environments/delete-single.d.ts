import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const deleteSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map