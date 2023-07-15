import { PoolClient } from "pg";
type EnvironmentGetAll = (client: PoolClient) => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (client: PoolClient, data: {
    key: string;
}) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (client: PoolClient, data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
}) => Promise<EnvironmentT>;
type EnvironmentDeleteSingle = (client: PoolClient, data: {
    key: string;
}) => Promise<EnvironmentT>;
export type EnvironmentT = {
    key: string;
    title: string | null;
    assigned_bricks: string[] | null;
    assigned_collections: string[] | null;
    assigned_forms: string[] | null;
};
export default class Environment {
    static getAll: EnvironmentGetAll;
    static getSingle: EnvironmentGetSingle;
    static upsertSingle: EnvironmentUpsertSingle;
    static deleteSingle: EnvironmentDeleteSingle;
}
export {};
//# sourceMappingURL=Environment.d.ts.map