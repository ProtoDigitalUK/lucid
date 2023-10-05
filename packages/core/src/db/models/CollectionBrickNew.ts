import { PoolClient } from "pg";
import z from "zod";
import { FieldTypes } from "@builders/brick-builder/index.js";
// Utils
import { aliasGenerator } from "@utils/app/query-helpers.js";
// Schema
import { BrickSchemaNew, FieldSchemaNew } from "@schemas/bricks.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Builders
import { CollectionBrickConfigT } from "@builders/collection-builder/index.js";

// -------------------------------------------
// Collection Brick
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
  repeater_key: string | null;
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
  // Collection Brick
  static getAllBricks: CollectionBrickGetAllBricks = async (client, data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    // Fetch all bricks for the page
    const collectionBrickIds = await client.query<{
      id: number;
      fields: { id: number }[];
    }>({
      text: `SELECT 
        lucid_collection_bricks.id,
        COALESCE(json_agg(
          json_build_object('id', lucid_fields.fields_id) 
        ) FILTER (WHERE lucid_fields.fields_id IS NOT NULL), '[]'::json) as fields
      FROM lucid_collection_bricks 
      LEFT JOIN lucid_fields ON lucid_collection_bricks.id = lucid_fields.collection_brick_id
      WHERE ${referenceKey} = $1
      GROUP BY lucid_collection_bricks.id`,
      values: [data.reference_id],
    });

    return collectionBrickIds.rows;
  };
  static deleteMultipleBricks: CollectionBrickDeleteMultipleBricks = async (
    client,
    data
  ) => {
    await client.query({
      text: `DELETE FROM lucid_collection_bricks WHERE id = ANY($1)`,
      values: [data.ids],
    });
  };
  static createMultipleBricks: CollectionBrickCreateMultiple = async (
    client,
    data
  ) => {
    // If no bricks to update, early return.
    if (data.bricks.length === 0) return [];

    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const aliases = aliasGenerator({
      columns: [
        {
          key: "brick_key",
        },
        {
          key: "brick_type",
        },
        {
          key: referenceKey,
        },
        {
          key: "brick_order",
        },
      ],
      rows: data.bricks.length,
    });
    const dataValues = data.bricks.flatMap((brick) => {
      return [brick.key, brick.type, data.reference_id, brick.order];
    });

    const brickRes = await client.query<{
      id: CollectionBrickT["id"];
      brick_order: CollectionBrickFieldsT["brick_order"];
      brick_key: CollectionBrickFieldsT["key"];
    }>(
      `INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ${aliases}
      RETURNING id, brick_order, brick_key`,
      dataValues
    );

    return brickRes.rows;
  };
  static updateMultipleBrickOrders: CollectionBrickUpdateMultiple = async (
    client,
    bricks
  ) => {
    // If no bricks to update, early return.
    if (bricks.length === 0) return [];

    // Construct a VALUES table to be used for the update
    const aliases = aliasGenerator({
      columns: [
        {
          key: "id",
          type: "int",
        },
        {
          key: "brick_order",
          type: "int",
        },
      ],
      rows: bricks.length,
    });

    const dataValues = bricks.flatMap((brick) => {
      return [brick.id, brick.order];
    });

    const result = await client.query<{
      id: CollectionBrickT["id"];
      brick_order: CollectionBrickT["brick_order"];
    }>(
      `WITH data_values (id, brick_order) AS (
            VALUES 
            ${aliases}
        ) 
      UPDATE lucid_collection_bricks
      SET brick_order = data_values.brick_order
      FROM data_values
      WHERE lucid_collection_bricks.id = data_values.id
      RETURNING lucid_collection_bricks.id, lucid_collection_bricks.brick_order`,
      dataValues
    );

    return result.rows;
  };

  // -------------------------------------------
  // Fields
  static deleteMultipleBrickFields: CollectionBrickDeleteMultipleFields =
    async (client, data) => {
      await client.query({
        text: `DELETE FROM lucid_fields WHERE fields_id = ANY($1)`,
        values: [data.ids],
      });
    };
  static createMultipleBrickFields: CollectionBrickCreateMultipleFields =
    async (client, data) => {
      if (data.fields.length === 0) return undefined;

      const aliases = aliasGenerator({
        columns: [
          {
            key: "collection_brick_id",
          },
          {
            key: "repeater_key",
          },
          {
            key: "key",
          },
          {
            key: "type",
          },
          {
            key: "group_position",
          },
          {
            key: "text_value",
          },
          {
            key: "int_value",
          },
          {
            key: "bool_value",
          },
          {
            key: "json_value",
          },
          {
            key: "page_link_id",
          },
          {
            key: "media_id",
          },
        ],
        rows: data.fields.length,
      });
      const dataValues = data.fields.flatMap((field) => {
        return [
          field.collection_brick_id,
          field.repeater_key,
          field.key,
          field.type,
          field.group_position,
          field.text_value,
          field.int_value,
          field.bool_value,
          field.json_value,
          field.page_link_id,
          field.media_id,
        ];
      });

      await client.query(
        `INSERT INTO 
          lucid_fields (collection_brick_id, repeater_key, key, type, group_position, text_value, int_value, bool_value, json_value, page_link_id, media_id) 
        VALUES 
          ${aliases}`,
        dataValues
      );
    };
  static updateMultipleBrickFields: CollectionBrickUpdateMultipleFields =
    async (client, data) => {
      if (data.fields.length === 0) return undefined;

      // Construct the VALUES table to be used for the update
      const aliases = aliasGenerator({
        columns: [
          { key: "fields_id", type: "int" },
          { key: "collection_brick_id", type: "int" },
          { key: "repeater_key", type: "text" },
          { key: "key", type: "text" },
          { key: "type", type: "text" },
          { key: "group_position", type: "int" },
          { key: "text_value", type: "text" },
          { key: "int_value", type: "int" },
          { key: "bool_value", type: "bool" },
          { key: "json_value", type: "jsonb" },
          { key: "page_link_id", type: "int" },
          { key: "media_id", type: "int" },
        ],
        rows: data.fields.length,
      });

      const dataValues = data.fields.flatMap((field) => {
        return [
          field.fields_id,
          field.collection_brick_id,
          field.repeater_key,
          field.key,
          field.type,
          field.group_position,
          field.text_value,
          field.int_value,
          field.bool_value,
          field.json_value,
          field.page_link_id,
          field.media_id,
        ];
      });

      await client.query({
        text: `WITH data_values (fields_id, collection_brick_id, repeater_key, key, type, group_position, text_value, int_value, bool_value, json_value, page_link_id, media_id) AS (
            VALUES ${aliases}
          )
          UPDATE lucid_fields
          SET
            text_value = data_values.text_value,
            int_value = data_values.int_value,
            bool_value = data_values.bool_value,
            json_value = data_values.json_value,
            page_link_id = data_values.page_link_id,
            media_id = data_values.media_id
          FROM data_values
          WHERE lucid_fields.fields_id = data_values.fields_id;`,
        values: dataValues,
      });
    };
}

// -------------------------------------------
// Types
export type BrickFieldObject = z.infer<typeof FieldSchemaNew>;
export type BrickObject = z.infer<typeof BrickSchemaNew>;

export type BrickFieldUpdateObject = {
  fields_id?: number | undefined;
  collection_brick_id: number;
  repeater_key?: string | undefined;
  key: string;
  type: FieldTypes;
  group_position?: number | undefined;
  text_value: string | null;
  int_value: number | null;
  bool_value: boolean | null;
  json_value: any | null;
  page_link_id: number | null;
  media_id: number | null;
};

type CollectionBrickGetAllBricks = (
  client: PoolClient,
  data: {
    type: CollectionResT["type"];
    reference_id: number;
  }
) => Promise<
  {
    id: CollectionBrickT["id"];
    fields: { id: CollectionBrickFieldsT["id"] }[];
  }[]
>;

type CollectionBrickDeleteMultipleBricks = (
  client: PoolClient,
  data: {
    ids: CollectionBrickT["id"][];
  }
) => Promise<void>;

type CollectionBrickCreateMultiple = (
  client: PoolClient,
  data: {
    type: CollectionResT["type"];
    reference_id: number;
    bricks: BrickObject[];
  }
) => Promise<
  {
    id: CollectionBrickT["id"];
    brick_order: CollectionBrickT["brick_order"];
    brick_key: CollectionBrickFieldsT["key"];
  }[]
>;

type CollectionBrickUpdateMultiple = (
  client: PoolClient,
  bricks: {
    id: CollectionBrickT["id"];
    order: number;
  }[]
) => Promise<
  {
    id: CollectionBrickT["id"];
    brick_order: CollectionBrickT["brick_order"];
  }[]
>;

type CollectionBrickUpdateMultipleFields = (
  client: PoolClient,
  data: {
    fields: BrickFieldUpdateObject[];
  }
) => Promise<void>;

type CollectionBrickCreateMultipleFields = (
  client: PoolClient,
  data: {
    fields: BrickFieldUpdateObject[];
  }
) => Promise<void>;

type CollectionBrickDeleteMultipleFields = (
  client: PoolClient,
  data: {
    ids: CollectionBrickFieldsT["id"][];
  }
) => Promise<void>;
