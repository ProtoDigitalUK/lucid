import z from "zod";
import { FieldTypes } from "@lucid/brick-builder";
import { BrickResponseT } from "../../utils/bricks/format-bricks";
import { BrickSchema, FieldSchema } from "../../schemas/bricks";
import { EnvironmentT } from "../models/Environment";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { CollectionT } from "../../services/collections";
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;
type CollectionBrickCreateOrUpdate = (data: {
    reference_id: number;
    brick: BrickObject;
    brick_type: CollectionBrickConfigT["type"];
    order: number;
    environment: EnvironmentT;
    collection: CollectionT;
}) => Promise<number>;
type CollectionBrickGetAll = (data: {
    reference_id: number;
    type: CollectionT["type"];
    environment_key: string;
    collection: CollectionT;
}) => Promise<{
    builder_bricks: BrickResponseT[];
    fixed_bricks: BrickResponseT[];
}>;
type CollectionBrickDeleteUnused = (data: {
    type: CollectionT["type"];
    reference_id: number;
    brick_ids: Array<number | undefined>;
    brick_type: CollectionBrickConfigT["type"];
}) => Promise<void>;
export type CollectionBrickFieldsT = {
    id: number;
    brick_type: CollectionBrickConfigT["type"];
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
    json_value: any | null;
    page_link_id: number | null;
    media_id: number | null;
    linked_page: {
        title: string | null;
        slug: string | null;
        full_slug: string | null;
    };
    media: {
        key: string | null;
        mime_type: string | null;
        file_extension: string | null;
        file_size: number | null;
        width: number | null;
        height: number | null;
        name: string | null;
        alt: string | null;
    };
};
export type CollectionBrickT = {
    id: number;
    brick_type: CollectionBrickConfigT["type"];
    brick_key: string;
    page_id: number | null;
    singlepage_id: number | null;
    brick_order: number;
};
export default class CollectionBrick {
    #private;
    static createOrUpdate: CollectionBrickCreateOrUpdate;
    static getAll: CollectionBrickGetAll;
    static deleteUnused: CollectionBrickDeleteUnused;
}
export {};
//# sourceMappingURL=CollectionBrick.d.ts.map