import { PoolClient } from "pg";
import z from "zod";
import { FieldTypes } from "@builders/brick-builder/index.js";
// Utils
import { aliasGenerator } from "@utils/app/query-helpers.js";
// Schema
import { BrickSchema, FieldSchema, GroupSchema } from "@schemas/bricks.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Builders
import { CollectionBrickConfigT } from "@builders/collection-builder/index.js";

// -------------------------------------------
// Collection Brick
export type CollectionBrickFieldsT = {
  // Page brick info
  id: number;
  ref: string;
  brick_type: CollectionBrickConfigT["type"];
  brick_key: string;
  page_id: number | null;
  singlepage_id: number | null;
  brick_order: number;

  // Group info
  group_id: number | null;
  repeater_key: string | null;
  group_order: number | null;
  parent_group_id: number | null;

  // Fields info
  fields_id: number;
  collection_brick_id: number;
  key: string;
  type: FieldTypes;
  language_id: number;

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

export type CollectionBrickGroupT = {
  group_id: number;
  group_order: number;
  brick_id: number;
  ref: string;
  language_id: number | null;
  parent_group_id: number | null;
  repeater_key: string | null;
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
  static getAll: CollectionBrickGetAll = async (client, data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const brickFields = await client.query<CollectionBrickFieldsT>(
      `SELECT 
        lucid_collection_bricks.*,
        lucid_fields.*,
        lucid_groups.*,
        json_build_object(
          'title', lucid_page_content.title,
          'slug', lucid_page_content.slug
        ) as linked_page,
        json_build_object(
          'key', lucid_media.key,
          'mime_type', lucid_media.mime_type,
          'file_extension', lucid_media.file_extension,
          'file_size', lucid_media.file_size,
          'width', lucid_media.width,
          'height', lucid_media.height,
          'name', COALESCE(name_translation.value, ''),
          'alt', COALESCE(alt_translation.value, '')
        ) as media
      FROM 
        lucid_collection_bricks
      LEFT JOIN 
        lucid_fields
      ON 
        lucid_collection_bricks.id = lucid_fields.collection_brick_id
      LEFT JOIN 
        lucid_groups
      ON 
        lucid_fields.group_id = lucid_groups.group_id
      LEFT JOIN 
        lucid_pages
      ON 
        lucid_fields.page_link_id = lucid_pages.id
      LEFT JOIN 
        lucid_page_content
      ON 
        lucid_pages.id = lucid_page_content.page_id AND lucid_page_content.language_id = $2
      LEFT JOIN 
        lucid_media
      ON 
        lucid_fields.media_id = lucid_media.id
      LEFT JOIN 
        lucid_translations AS name_translation
      ON 
        lucid_media.name_translation_key_id = name_translation.translation_key_id AND name_translation.language_id = $2
      LEFT JOIN 
        lucid_translations AS alt_translation
      ON 
        lucid_media.alt_translation_key_id = alt_translation.translation_key_id AND alt_translation.language_id = $2
      WHERE 
        lucid_collection_bricks.${referenceKey} = $1
      ORDER BY 
        lucid_collection_bricks.brick_order, lucid_groups.group_order;`,
      [data.reference_id, data.default_language_id]
    );

    return brickFields.rows;
  };

  // -------------------------------------------
  // Collection Brick
  static getAllBricks: CollectionBrickGetAllBricks = async (client, data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const collectionBrickIds = await client.query<{
      id: number;
      fields: { id: number }[];
      groups: { group_id: number }[];
    }>({
      text: `SELECT 
        lucid_collection_bricks.id,
        COALESCE(json_agg(
          json_build_object('id', lucid_fields.fields_id) 
        ) FILTER (WHERE lucid_fields.fields_id IS NOT NULL), '[]'::json) as fields,
        COALESCE(json_agg(
          json_build_object('id', lucid_groups.group_id) 
        ) FILTER (WHERE lucid_groups.group_id IS NOT NULL), '[]'::json) as groups
      FROM lucid_collection_bricks 
      LEFT JOIN lucid_fields ON lucid_collection_bricks.id = lucid_fields.collection_brick_id
      LEFT JOIN lucid_groups ON lucid_collection_bricks.id = lucid_groups.collection_brick_id
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
    if (data.ids.length === 0) return;

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
      brick_order: CollectionBrickT["brick_order"];
      brick_key: CollectionBrickT["brick_key"];
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
  // Groups
  static deleteMultipleGroups: CollectionBrickDeleteMultipleGroups = async (
    client,
    data
  ) => {
    if (data.ids.length === 0) return;

    await client.query({
      text: `DELETE FROM lucid_groups WHERE group_id = ANY($1)`,
      values: [data.ids],
    });
  };
  static createMultipleGroups: CollectionBrickCreateMultipleGroups = async (
    client,
    data
  ) => {
    if (data.groups.length === 0) return [];

    const aliases = aliasGenerator({
      columns: [
        {
          key: "collection_brick_id",
        },
        {
          key: "group_order",
        },
        {
          key: "ref",
        },
        {
          key: "parent_group_id",
        },
        {
          key: "repeater_key",
        },
        {
          key: "language_id",
        },
      ],
      rows: data.groups.length,
    });
    const dataValues = data.groups.flatMap((group) => {
      return [
        group.collection_brick_id,
        group.group_order,
        group.group_id,
        group.parent_group_id,
        group.repeater_key,
        group.language_id,
      ];
    });

    const groups = await client.query<{
      group_id: CollectionBrickGroupT["group_id"];
      ref: CollectionBrickGroupT["ref"];
    }>(
      `INSERT INTO 
        lucid_groups (collection_brick_id, group_order, ref, parent_group_id, repeater_key, language_id) 
      VALUES 
        ${aliases}
      RETURNING group_id, ref`,
      dataValues
    );

    return groups.rows;
  };
  static updateMultipleGroups: CollectionBrickUpdateMultipleGroups = async (
    client,
    data
  ) => {
    if (data.groups.length === 0) return;

    // Construct the VALUES table to be used for the update
    const aliases = aliasGenerator({
      columns: [
        {
          key: "group_id",
          type: "int",
        },
        {
          key: "group_order",
          type: "int",
        },
        {
          key: "parent_group_id",
          type: "int",
        },
      ],
      rows: data.groups.length,
    });

    const dataValues = data.groups.flatMap((group) => {
      return [group.group_id, group.group_order, group.parent_group_id];
    });

    await client.query({
      text: `WITH data_values (group_id, group_order, parent_group_id) AS (
          VALUES ${aliases}
        )
        UPDATE lucid_groups
        SET 
          group_order = data_values.group_order,
          parent_group_id = data_values.parent_group_id
        FROM data_values
        WHERE lucid_groups.group_id = data_values.group_id;`,
      values: dataValues,
    });
  };

  // -------------------------------------------
  // Fields
  static deleteMultipleBrickFields: CollectionBrickDeleteMultipleFields =
    async (client, data) => {
      if (data.ids.length === 0) return;

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
            key: "key",
          },
          {
            key: "type",
          },
          {
            key: "group_id",
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
          {
            key: "language_id",
          },
        ],
        rows: data.fields.length,
      });
      const dataValues = data.fields.flatMap((field) => {
        return [
          field.collection_brick_id,
          field.key,
          field.type,
          field.group_id,
          field.text_value,
          field.int_value,
          field.bool_value,
          field.json_value,
          field.page_link_id,
          field.media_id,
          field.language_id,
        ];
      });

      await client.query(
        `INSERT INTO 
          lucid_fields (collection_brick_id, key, type, group_id, text_value, int_value, bool_value, json_value, page_link_id, media_id, language_id) 
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
          { key: "key", type: "text" },
          { key: "type", type: "text" },
          { key: "group_id", type: "int" },
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
          field.key,
          field.type,
          field.group_id,
          field.text_value,
          field.int_value,
          field.bool_value,
          field.json_value,
          field.page_link_id,
          field.media_id,
        ];
      });

      await client.query({
        text: `WITH data_values (fields_id, collection_brick_id, key, type, group_id, text_value, int_value, bool_value, json_value, page_link_id, media_id) AS (
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
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;
export type GroupObject = z.infer<typeof GroupSchema>;

export type BrickFieldUpdateObject = {
  fields_id?: number | undefined;
  collection_brick_id: number;
  key: string;
  type: FieldTypes;
  group_id?: number | string;
  text_value: string | null;
  int_value: number | null;
  bool_value: boolean | null;
  json_value: any | null;
  page_link_id: number | null;
  media_id: number | null;
  language_id: number;
};

export type BrickGroupUpdateObject = {
  group_id?: number | string;
  collection_brick_id?: number;
  group_order: number;
  parent_group_id?: number | string | null;
  repeater_key?: string;
  ref?: string | number;
  language_id: number;
};

type CollectionBrickGetAll = (
  client: PoolClient,
  data: {
    reference_id: number;
    type: CollectionResT["type"];
    default_language_id: number;
  }
) => Promise<CollectionBrickFieldsT[]>;

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
    groups: { group_id: CollectionBrickGroupT["group_id"] }[];
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
    brick_key: CollectionBrickT["brick_key"];
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

type CollectionBrickDeleteMultipleGroups = (
  client: PoolClient,
  data: {
    ids: CollectionBrickGroupT["group_id"][];
  }
) => Promise<void>;

type CollectionBrickCreateMultipleGroups = (
  client: PoolClient,
  data: {
    groups: BrickGroupUpdateObject[];
  }
) => Promise<
  {
    group_id: CollectionBrickGroupT["group_id"];
    ref: CollectionBrickGroupT["ref"];
  }[]
>;

type CollectionBrickUpdateMultipleGroups = (
  client: PoolClient,
  data: {
    groups: BrickGroupUpdateObject[];
  }
) => Promise<void>;
