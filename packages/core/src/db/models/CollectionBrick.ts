import z from "zod";
import getDBClient from "@db/db";
import { FieldTypes } from "@lucid/brick-builder";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers";
import generateFieldQuery from "@utils/bricks/generate-field-query";
// Schema
import { BrickSchema, FieldSchema } from "@schemas/bricks";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Services
import { CollectionT } from "@services/collections";

// -------------------------------------------
// Types
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;

// Functions
type CollectionBrickGetAll = (data: {
  reference_id: number;
  type: CollectionT["type"];
}) => Promise<CollectionBrickFieldsT[]>;

type CollectionBrickCreateSingle = (data: {
  type: CollectionT["type"];
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

// -------------------------------------------
// Page Brick
export type CollectionBrickFieldsT = {
  // Page brick info
  id: number;
  brick_type: CollectionBrickConfigT["type"];
  brick_key: string;
  page_id: number | null;
  singlepage_id: number | null;
  brick_order: number;

  // Fields info
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

  // Page Join
  linked_page: {
    title: string | null;
    slug: string | null;
    full_slug: string | null;
  };

  // Media Join
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
  // Fields info
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
  // -------------------------------------------
  // Functions
  static getAll: CollectionBrickGetAll = async (data) => {
    const client = await getDBClient;

    // join all lucid_fields in flat structure, making sure to join page_link_id or media_id if applicable
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const brickFields = await client.query<CollectionBrickFieldsT>(
      `SELECT 
          lucid_collection_bricks.*,
          lucid_fields.*,
          json_build_object(
            'title', lucid_pages.title,
            'slug', lucid_pages.slug,
            'full_slug', lucid_pages.full_slug
          ) as linked_page,
          json_build_object(
            'key', lucid_media.key,
            'mime_type', lucid_media.mime_type,
            'file_extension', lucid_media.file_extension,
            'file_size', lucid_media.file_size,
            'width', lucid_media.width,
            'height', lucid_media.height,
            'name', lucid_media.name,
            'alt', lucid_media.alt
          ) as media
        FROM 
          lucid_collection_bricks
        LEFT JOIN 
          lucid_fields
        ON 
          lucid_collection_bricks.id = lucid_fields.collection_brick_id
        LEFT JOIN 
          lucid_pages
        ON 
          lucid_fields.page_link_id = lucid_pages.id
        LEFT JOIN 
          lucid_media
        ON 
          lucid_fields.media_id = lucid_media.id
        WHERE 
          lucid_collection_bricks.${referenceKey} = $1
        ORDER BY 
          lucid_collection_bricks.brick_order`,
      [data.reference_id]
    );

    return brickFields.rows;
  };
  // -------------------------------------------
  // Page Brick
  static createSingleBrick: CollectionBrickCreateSingle = async (data) => {
    const client = await getDBClient;

    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const brickRes = await client.query<CollectionBrickT>(
      `INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING *`,
      [data.brick.key, data.brick_type, data.reference_id, data.order]
    );

    return brickRes.rows[0];
  };
  static updateSingleBrick: CollectionBrickUpdateSingle = async (data) => {
    const client = await getDBClient;

    const brickRes = await client.query<CollectionBrickT>(
      `UPDATE 
        lucid_collection_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      AND
        brick_type = $3
      RETURNING *`,
      [data.order, data.brick.id, data.brick_type]
    );

    return brickRes.rows[0];
  };
  static getAllBricks = async (
    type: CollectionT["type"],
    reference_id: number,
    brick_type: CollectionBrickConfigT["type"]
  ) => {
    const client = await getDBClient;

    const referenceKey = type === "pages" ? "page_id" : "singlepage_id";

    // Fetch all bricks for the page
    const collectionBrickIds = await client.query<CollectionBrickT>({
      text: `SELECT id FROM lucid_collection_bricks WHERE ${referenceKey} = $1 AND brick_type = $2`,
      values: [reference_id, brick_type],
    });

    return collectionBrickIds.rows;
  };
  static deleteSingleBrick = async (id: number) => {
    const client = await getDBClient;

    const brickRes = await client.query<CollectionBrickT>({
      text: `DELETE FROM lucid_collection_bricks WHERE id = $1 RETURNING *`,
      values: [id],
    });

    return brickRes.rows[0];
  };
  // -------------------------------------------
  // Fields
  static updateField = async (brick_id: number, data: BrickFieldObject) => {
    const client = await getDBClient;

    const { columns, aliases, values } = generateFieldQuery({
      brick_id: brick_id,
      data: data,
      mode: "update",
    });

    const fieldRes = await client.query<FieldsT>({
      text: `UPDATE lucid_fields SET ${
        columns.formatted.update
      } WHERE fields_id = $${aliases.value.length + 1} RETURNING *`,
      values: [...values.value, data.fields_id],
    });

    return fieldRes.rows[0];
  };
  static createField = async (brick_id: number, data: BrickFieldObject) => {
    const client = await getDBClient;

    // Create the field
    const { columns, aliases, values } = generateFieldQuery({
      brick_id: brick_id,
      data: data,
      mode: "create",
    });

    const fieldRes = await client.query<FieldsT>({
      text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return fieldRes.rows[0];
  };
  static checkFieldExists: CollectionBrickCheckFieldExists = async (data) => {
    const client = await getDBClient;

    let queryText =
      "SELECT EXISTS(SELECT 1 FROM lucid_fields WHERE collection_brick_id = $1 AND key = $2 AND type = $3";
    let queryValues = [data.brick_id, data.key, data.type];

    // If parent repeater is provided, add it to the query
    if (data.parent_repeater !== undefined) {
      queryText += " AND parent_repeater = $4";
      queryValues.push(data.parent_repeater);
    }

    // If group_position is provided, add it to the query
    if (data.group_position !== undefined) {
      queryText += " AND group_position = $5";
      queryValues.push(data.group_position);
    }

    queryText += ")";

    const res = await client.query<{ exists: boolean }>({
      text: queryText,
      values: queryValues,
    });

    return res.rows[0].exists;
  };
  // -------------------------------------------
  // Repeater Field
  static updateRepeater = async (data: BrickFieldObject) => {
    const client = await getDBClient;

    const repeaterRes = await client.query<FieldsT>({
      text: `UPDATE lucid_fields SET group_position = $1 WHERE fields_id = $2 RETURNING *`,
      values: [data.group_position, data.fields_id],
    });

    return repeaterRes.rows[0];
  };
  static createRepeater = async (brick_id: number, data: BrickFieldObject) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "collection_brick_id",
        "key",
        "type",
        "parent_repeater",
        "group_position",
      ],
      values: [
        brick_id,
        data.key,
        data.type,
        data.parent_repeater,
        data.group_position,
      ],
    });

    const repeaterRes = await client.query<FieldsT>({
      text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return repeaterRes.rows[0];
  };
}
