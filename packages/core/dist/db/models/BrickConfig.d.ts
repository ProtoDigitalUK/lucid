import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
interface QueryParams extends ModelQueryParams {
    include?: Array<"fields">;
    filter?: {
        s?: string;
        collection_key?: Array<string> | string;
        environment_key?: string;
        environment_bricks?: Array<string>;
    };
    sort?: Array<{
        key: "name";
        value: "asc" | "desc";
    }>;
}
type BrickConfigGetAll = (query: QueryParams, environment_key: string) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (key: string, environment_key: string) => Promise<BrickConfigT>;
export type BrickConfigT = {
    key: string;
    title: string;
    fields?: CustomField[];
};
export default class BrickConfig {
    #private;
    static getSingle: BrickConfigGetSingle;
    static getAll: BrickConfigGetAll;
    static getBrickConfig: () => BrickBuilderT[];
    static getBrickData: (instance: BrickBuilderT, query?: QueryParams) => BrickConfigT;
}
export {};
//# sourceMappingURL=BrickConfig.d.ts.map