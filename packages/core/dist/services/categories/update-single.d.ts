import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    id: number;
    data: {
        title?: string;
        slug?: string;
        description?: string;
    };
}
declare const updateSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map