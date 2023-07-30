import { PoolClient } from "pg";
export interface ServiceData {
    brick_key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../../../types/src/bricks").BrickConfigT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map