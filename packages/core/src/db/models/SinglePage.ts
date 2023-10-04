import { PoolClient } from "pg";
// Models
import { BrickObject } from "@db/models/CollectionBrick.js";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Types
import { BrickResT } from "@lucid/types/src/bricks.js";

// -------------------------------------------
// Types
type SinglePageGetSingle = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<SinglePageT>;

type SinglePageCreateSingle = (
  client: PoolClient,
  data: {
    user_id: number;
    environment_key: string;
    collection_key: string;
    builder_bricks?: Array<BrickObject>;
    fixed_bricks?: Array<BrickObject>;
  }
) => Promise<SinglePageT>;

type SinglePageUpdateSingle = (
  client: PoolClient,
  data: {
    id: number;
    user_id: number;
  }
) => Promise<SinglePageT>;

// -------------------------------------------
// Single Page
export type SinglePageT = {
  id: number;
  environment_key: string;
  collection_key: string;

  builder_bricks?: Array<BrickResT> | null;
  fixed_bricks?: Array<BrickResT> | null;

  created_at: string;
  updated_at: string;
  updated_by: string;
};

export default class SinglePage {
  static getSingle: SinglePageGetSingle = async (client, query_instance) => {
    const singlepage = await client.query<SinglePageT>({
      text: `SELECT
          ${query_instance.query.select}
        FROM
          lucid_singlepages
        ${query_instance.query.where}`,
      values: query_instance.values,
    });

    return singlepage.rows[0];
  };
  static createSingle: SinglePageCreateSingle = async (client, data) => {
    const res = await client.query<SinglePageT>({
      text: `INSERT INTO lucid_singlepages ( environment_key, collection_key, updated_by ) VALUES ($1, $2, $3) RETURNING *`,
      values: [data.environment_key, data.collection_key, data.user_id],
    });

    return res.rows[0];
  };
  static updateSingle: SinglePageUpdateSingle = async (client, data) => {
    const updateSinglePage = await client.query<SinglePageT>({
      text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
      values: [data.user_id, data.id],
    });

    return updateSinglePage.rows[0];
  };
}
