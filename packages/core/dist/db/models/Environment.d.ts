import { EnvironmentResT } from "../../utils/environments/format-environment";
type EnvironmentGetAll = () => Promise<EnvironmentResT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentResT>;
type EnvironmentUpsertSingle = (data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
}, create: boolean) => Promise<EnvironmentResT>;
type EnvironmentDeleteSingle = (key: string) => Promise<EnvironmentResT>;
export type EnvironmentT = {
    key: string;
    title: string | null;
    assigned_bricks: string[] | null;
    assigned_collections: string[] | null;
    assigned_forms: string[] | null;
};
export default class Environment {
    #private;
    static getAll: EnvironmentGetAll;
    static getSingle: EnvironmentGetSingle;
    static upsertSingle: EnvironmentUpsertSingle;
    static deleteSingle: EnvironmentDeleteSingle;
}
export {};
//# sourceMappingURL=Environment.d.ts.map