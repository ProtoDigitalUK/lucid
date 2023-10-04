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
  static createSingleBrick: CollectionBrickCreateSingle = async (
    client,
    data
  ) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const brickRes = await client.query<{
      id: CollectionBrickT["id"];
    }>(
      `INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING id`,
      [data.brick.key, data.brick.type, data.reference_id, data.brick.order]
    );

    return brickRes.rows[0];
  };
  static updateSingleBrick: CollectionBrickUpdateSingle = async (
    client,
    data
  ) => {
    const brickRes = await client.query<{
      id: CollectionBrickT["id"];
    }>(
      `UPDATE 
        lucid_collection_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      AND
        brick_type = $3
      RETURNING id`,
      [data.brick.order, data.brick.id, data.brick.type]
    );

    return brickRes.rows[0];
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
