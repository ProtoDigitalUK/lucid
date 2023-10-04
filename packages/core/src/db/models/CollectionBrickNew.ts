import { PoolClient } from "pg";
import z from "zod";
import { FieldTypes } from "@builders/brick-builder/index.js";
// Schema
import { BrickSchemaNew, FieldSchema } from "@schemas/bricks.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Builders
import { CollectionBrickConfigT } from "@builders/collection-builder/index.js";
import { type } from "os";

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
      id: CollectionBrickT["id"];
    }>({
      text: `SELECT id FROM lucid_collection_bricks WHERE ${referenceKey} = $1`,
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

    const totalFields = 4;

    const aliases = data.bricks
      .map((_, index) => {
        return `($${index * totalFields + 1}, $${index * totalFields + 2}, $${
          index * totalFields + 3
        }, $${index * totalFields + 4})`;
      })
      .join(", ");

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
    const valuesTable = bricks
      .map((_, index) => {
        return `($${index * 2 + 1}::int, $${index * 2 + 2}::int)`;
      })
      .join(", ");

    const dataValues = bricks.flatMap((brick) => {
      return [brick.id, brick.order];
    });

    const result = await client.query<{
      id: CollectionBrickT["id"];
      brick_order: CollectionBrickT["brick_order"];
    }>(
      `WITH data_values AS (
            VALUES 
            ${valuesTable}
        ) AS (id, brick_order)
        UPDATE lucid_collection_bricks
        SET brick_order = data_values.brick_order
        FROM data_values
        WHERE lucid_collection_bricks.id = data_values.id
        RETURNING lucid_collection_bricks.id, brick_order`,
      dataValues
    );

    return result.rows;
  };

  // -------------------------------------------
  // Fields
}

// -------------------------------------------
// Types
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchemaNew>;

type CollectionBrickGetAllBricks = (
  client: PoolClient,
  data: {
    type: CollectionResT["type"];
    reference_id: number;
  }
) => Promise<
  {
    id: CollectionBrickT["id"];
  }[]
>;

type CollectionBrickDeleteMultipleBricks = (
  client: PoolClient,
  data: {
    ids: CollectionBrickT["id"][];
  }
) => Promise<void>;

type CollectionBrickCreateSingle = (
  client: PoolClient,
  data: {
    type: CollectionResT["type"];
    reference_id: number;
    brick: BrickObject;
  }
) => Promise<{
  id: CollectionBrickT["id"];
}>;

type CollectionBrickUpdateSingle = (
  client: PoolClient,
  data: {
    brick: BrickObject;
  }
) => Promise<{
  id: CollectionBrickT["id"];
}>;

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
