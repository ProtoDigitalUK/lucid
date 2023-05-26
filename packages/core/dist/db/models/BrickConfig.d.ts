import { Request } from "express";
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
interface QueryParams {
    include?: Array<"fields">;
    exclude?: Array<string>;
    filter?: {
        s?: string;
    };
    sort?: Array<{
        key: "name";
        value: "asc" | "desc";
    }>;
}
type BrickConfigGetAll = (req: Request, query: QueryParams) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (req: Request, key: string) => Promise<BrickConfigT>;
type BrickConfigValidData = (req: Request, data: any) => Promise<boolean>;
export type BrickConfigT = {
    key: string;
    title: string;
    fields?: CustomField[];
};
export default class BrickConfig {
    static getSingle: BrickConfigGetSingle;
    static getAll: BrickConfigGetAll;
    static validData: BrickConfigValidData;
    static getBrickConfig: (req: Request) => BrickBuilderT[];
    static getBrickData: (instance: BrickBuilderT, query?: QueryParams) => BrickConfigT;
    static searcBricks: (query: string, bricks: BrickConfigT[]) => BrickConfigT[];
    static filterBricks: (filter: QueryParams["filter"], bricks: BrickConfigT[]) => BrickConfigT[];
    static sortBricks: (sort: QueryParams["sort"], bricks: BrickConfigT[]) => BrickConfigT[];
}
export {};
//# sourceMappingURL=BrickConfig.d.ts.map