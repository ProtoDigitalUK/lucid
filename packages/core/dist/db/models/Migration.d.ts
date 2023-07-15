import { PoolClient } from "pg";
type MigrationAll = (client: PoolClient) => Promise<MigrationT[]>;
type MigrationCreate = (client: PoolClient, data: {
    file: string;
    rawSql: string;
}) => Promise<void>;
export type MigrationT = {
    id: string;
    file: string;
    created_at: string;
};
export default class Migration {
    static all: MigrationAll;
    static create: MigrationCreate;
}
export {};
//# sourceMappingURL=Migration.d.ts.map