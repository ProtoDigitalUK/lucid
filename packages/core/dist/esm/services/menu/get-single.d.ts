import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../utils/format/format-menu.js").MenuResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map