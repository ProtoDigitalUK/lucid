import z from "zod";
import { FieldTypes } from "@lucid/brick-builder";
import { BrickSchema, FieldSchema } from "../../schemas/bricks";
import { CollectionT } from "./Collection";
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;
interface LinkJsonT {
    target: "_blank" | "_self";
}
type BrickDataCreateOrUpdate = (brick: BrickObject, order: number, type: "page" | "group", referenceId: number) => Promise<number>;
type BrickDataGetAll = (type: "page" | "group", referenceId: number, environment_key: string, collection: CollectionT) => Promise<Array<any>>;
type BrickDataDeleteUnused = (type: "page" | "group", referenceId: number, brickIds: Array<number | undefined>) => Promise<void>;
export type BrickFieldsT = {
    id: number;
    brick_key: string;
    page_id: number | null;
    group_id: number | null;
    brick_order: number;
    fields_id: number;
    page_brick_id: number;
    parent_repeater: number | null;
    key: string;
    type: FieldTypes;
    group_position: number | null;
    text_value: string | null;
    int_value: number | null;
    bool_value: boolean | null;
    json_value: LinkJsonT | any | null;
    media_id: number | null;
    page_link_id: number | null;
    linked_page_title: string | null;
    linked_page_slug: string | null;
    linked_page_full_slug: string | null;
};
export default class BrickData {
    #private;
    static createOrUpdate: BrickDataCreateOrUpdate;
    static getAll: BrickDataGetAll;
    static deleteUnused: BrickDataDeleteUnused;
}
export {};
//# sourceMappingURL=BrickData.d.ts.map