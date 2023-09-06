import { PoolClient } from "pg";
export interface ServiceData {
    brick_id: number;
    key: string;
    type: string;
    parent_repeater?: number;
    group_position?: number;
    create: boolean;
}
declare const checkFieldExists: (client: PoolClient, data: ServiceData) => Promise<void>;
export default checkFieldExists;
//# sourceMappingURL=check-field-exists.d.ts.map