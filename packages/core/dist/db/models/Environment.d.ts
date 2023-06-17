type EnvironmentGetAll = () => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
}) => Promise<EnvironmentT>;
export type EnvironmentT = {
    key: string;
    title: string | null;
    assigned_bricks: string[] | null;
    assigned_collections: string[] | null;
};
export default class Environment {
    static getAll: EnvironmentGetAll;
    static getSingle: EnvironmentGetSingle;
    static upsertSingle: EnvironmentUpsertSingle;
}
export {};
//# sourceMappingURL=Environment.d.ts.map