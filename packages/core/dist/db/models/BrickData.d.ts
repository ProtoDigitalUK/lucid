import z from "zod";
import { FieldTypes } from "@lucid/brick-builder";
import { BrickResponseT } from "../../services/bricks/format-bricks";
import { BrickSchema, FieldSchema } from "../../schemas/bricks";
import { CollectionT } from "../models/Collection";
import { EnvironmentT } from "../models/Environment";
import { CollectionBrickT } from "@lucid/collection-builder";
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;
interface LinkJsonT {
    target: "_blank" | "_self";
}
type BrickDataCreateOrUpdate = (data: {
    reference_id: number;
    brick: BrickObject;
    brick_type: CollectionBrickT["type"];
    order: number;
    collection_type: CollectionT["type"];
    environment: EnvironmentT;
    collection: CollectionT;
}) => Promise<number>;
type BrickDataGetAll = (data: {
    reference_id: number;
    type: CollectionT["type"];
    environment_key: string;
    collection: CollectionT;
}) => Promise<{
    builder_bricks: BrickResponseT[];
    fixed_bricks: BrickResponseT[];
}>;
type BrickDataDeleteUnused = (data: {
    type: CollectionT["type"];
    reference_id: number;
    brick_ids: Array<number | undefined>;
    brick_type: CollectionBrickT["type"];
}) => Promise<void>;
export type BrickFieldsT = {
    id: number;
    brick_type: CollectionBrickT["type"];
    brick_key: string;
    page_id: number | null;
    singlepage_id: number | null;
    brick_order: number;
    fields_id: number;
    collection_brick_id: number;
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
export type BrickT = {
    id: number;
    brick_type: CollectionBrickT["type"];
    brick_key: string;
    page_id: number | null;
    singlepage_id: number | null;
    brick_order: number;
};
export default class BrickData {
    #private;
    static createOrUpdate: BrickDataCreateOrUpdate;
    static getAll: BrickDataGetAll;
    static deleteUnused: BrickDataDeleteUnused;
}
export {};
//# sourceMappingURL=BrickData.d.ts.map