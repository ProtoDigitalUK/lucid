import z from "zod";
import { FieldTypes } from "@lucid/brick-builder";
import { BrickSchema, FieldSchema } from "../../schemas/bricks";
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;
type BrickDataCreateOrUpdate = (brick: BrickObject, order: number, type: "page" | "group", referenceId: number) => Promise<number>;
type BrickDataDeleteUnused = (type: "page" | "group", referenceId: number, brickIds: Array<number | undefined>) => Promise<void>;
export type BrickDataT = {
    id: number;
    brick_key: string;
    page_id?: number;
    group_id?: number;
    brick_order: number;
    fields?: Array<{
        id: number;
        page_brick_id: number;
        parent_repeater: number | null;
        key: string;
        type: FieldTypes;
        group_position?: number;
        text_value?: string;
        int_value?: number;
        bool_value?: boolean;
        datetime_value?: string;
        json_value?: any;
        image_value?: string;
        file_value?: string;
        items?: Array<BrickDataT["fields"]>;
    }>;
};
export default class BrickData {
    #private;
    static createOrUpdate: BrickDataCreateOrUpdate;
    static deleteUnused: BrickDataDeleteUnused;
}
export {};
//# sourceMappingURL=BrickData.d.ts.map