import z from "zod";
import { BrickBuilderT } from "../../builders/brick-builder/index.js";
import bricksSchema from "../../schemas/bricks.js";
import { BrickConfigT } from "@lucid/types/src/bricks.js";
export interface ServiceData {
    instance: BrickBuilderT;
    query?: z.infer<typeof bricksSchema.config.getAll.query>;
}
declare const getBrickData: (instance: BrickBuilderT, query?: {
    include?: "fields"[] | undefined;
    filter?: {
        collection_key?: string | undefined;
        environment_key?: string | undefined;
    } | undefined;
} | undefined) => BrickConfigT;
export default getBrickData;
//# sourceMappingURL=get-brick-data.d.ts.map