import z from "zod";
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
import bricksSchema from "../../schemas/bricks";
type BrickConfigGetAll = (environment_key: string, query: z.infer<typeof bricksSchema.getAll.query>) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (environment_key: string, key: string) => Promise<BrickConfigT>;
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
    static getBrickData: (instance: BrickBuilderT, query?: {
        include?: "fields"[] | undefined;
        filter?: {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "name";
        }[] | undefined;
    } | undefined) => BrickConfigT;
}
export {};
//# sourceMappingURL=BrickConfig.d.ts.map