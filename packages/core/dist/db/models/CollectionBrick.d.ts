import z from "zod";
import { FieldTypes } from "@lucid/brick-builder";
import { BrickSchema, FieldSchema } from "../../schemas/bricks";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import { CollectionResT } from "../../utils/format/format-collections";
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;
type CollectionBrickGetAll = (data: {
    reference_id: number;
    type: CollectionResT["type"];
}) => Promise<CollectionBrickFieldsT[]>;
type CollectionBrickCreateSingle = (data: {
    type: CollectionResT["type"];
    reference_id: number;
    order: number;
    brick: BrickObject;
    brick_type: CollectionBrickConfigT["type"];
}) => Promise<CollectionBrickT>;
type CollectionBrickUpdateSingle = (data: {
    order: number;
    brick: BrickObject;
    brick_type: CollectionBrickConfigT["type"];
}) => Promise<CollectionBrickT>;
type CollectionBrickCheckFieldExists = (data: {
    brick_id: number;
    key: string;
    type: string;
    parent_repeater?: number;
    group_position?: number;
}) => Promise<boolean>;
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
export type FieldsT = {
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
    static getAll: CollectionBrickGetAll;
    static createSingleBrick: CollectionBrickCreateSingle;
    static updateSingleBrick: CollectionBrickUpdateSingle;
    static getAllBricks: (type: CollectionResT["type"], reference_id: number, brick_type: CollectionBrickConfigT["type"]) => Promise<CollectionBrickT[]>;
    static deleteSingleBrick: (id: number) => Promise<CollectionBrickT>;
    static updateField: (brick_id: number, data: BrickFieldObject) => Promise<FieldsT>;
    static createField: (brick_id: number, data: BrickFieldObject) => Promise<FieldsT>;
    static checkFieldExists: CollectionBrickCheckFieldExists;
    static updateRepeater: (data: BrickFieldObject) => Promise<FieldsT>;
    static createRepeater: (brick_id: number, data: BrickFieldObject) => Promise<FieldsT>;
}
export {};
//# sourceMappingURL=CollectionBrick.d.ts.map