import z from "zod";
import { BrickBuilderT } from "@lucid/brick-builder";
import bricksSchema from "../../schemas/bricks";
import { BrickConfigT } from "../brick-config";
export interface ServiceData {
    instance: BrickBuilderT;
    query?: z.infer<typeof bricksSchema.config.getAll.query>;
}
declare const getBrickData: (instance: BrickBuilderT, query?: {
    include?: "fields"[] | undefined;
} | undefined) => BrickConfigT;
export default getBrickData;
//# sourceMappingURL=get-brick-data.d.ts.map