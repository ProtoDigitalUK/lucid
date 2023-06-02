import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
interface QueryParams extends ModelQueryParams {
    include?: Array<"fields">;
    filter?: {
        s?: string;
        collection_key?: Array<string> | string;
    };
    sort?: Array<{
        key: "name";
        value: "asc" | "desc";
    }>;
}
type BrickConfigGetAll = (query: QueryParams) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (key: string) => Promise<BrickConfigT>;
type BrickConfigValidData = (data: any) => Promise<boolean>;
export type BrickConfigT = {
    key: string;
    title: string;
    fields?: CustomField[];
};
export default class BrickConfig {
    #private;
    static getSingle: BrickConfigGetSingle;
    static getAll: BrickConfigGetAll;
    static validData: BrickConfigValidData;
    static getBrickConfig: () => BrickBuilderT[];
    static getBrickData: (instance: BrickBuilderT, query?: QueryParams) => BrickConfigT;
}
export {};
//# sourceMappingURL=BrickConfig.d.ts.map