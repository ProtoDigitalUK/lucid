type EnvironmentGetAll = () => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
}) => Promise<EnvironmentT>;
type EnvironmentDeleteSingle = (key: string) => Promise<EnvironmentT>;
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
    static checkKeyExists: (key: string) => Promise<EnvironmentT[]>;
}
export {};
//# sourceMappingURL=Environment.d.ts.map