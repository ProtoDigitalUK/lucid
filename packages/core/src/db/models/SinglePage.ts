import getDBClient from "@db/db";
// Models
import Collection from "@db/models/Collection";
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrick";
import Environment from "@db/models/Environment";
// Utils
import { BrickResponseT } from "@utils/bricks/format-bricks";
import validateBricks from "@utils/bricks/validate-bricks";
import { LucidError } from "@utils/app/error-handler";
import { SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type SinglePageGetSingle = (data: {
  environment_key: string;
  collection_key: string;
}) => Promise<SinglePageT>;

type SinglePageUpdateSingle = (data: {
  userId: number;
  environment_key: string;
  collection_key: string;
  builder_bricks?: Array<BrickObject>;
  fixed_bricks?: Array<BrickObject>;
}) => Promise<SinglePageT>;

// -------------------------------------------
// Single Page
export type SinglePageT = {
  id: number;
  environment_key: string;
  collection_key: string;

  builder_bricks?: Array<BrickResponseT> | null;
  fixed_bricks?: Array<BrickResponseT> | null;

  created_at: string;
  updated_at: string;
  updated_by: string;
};

export default class SinglePage {
  // -------------------------------------------
  // Functions
  static getSingle: SinglePageGetSingle = async (data) => {
    const client = await getDBClient;

    // Checks if we have access to the collection
    const collection = await Collection.getSingle({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: "singlepage",
    });

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "environment_key",
        "collection_key",

        "created_at",
        "updated_at",
        "updated_by",
      ],
      exclude: undefined,
      filter: {
        data: {
          collection_key: data.collection_key,
          environment_key: data.environment_key,
        },
        meta: {
          collection_key: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
          environment_key: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
        },
      },
      sort: undefined,
      page: undefined,
      per_page: undefined,
    });

    const singlepage = await client.query<SinglePageT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
        lucid_singlepages
        ${SelectQuery.query.where}`,
      values: SelectQuery.values,
    });

    if (singlepage.rows.length === 0) {
      const newSinglePage = await SinglePage.updateSingle({
        userId: 1,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        builder_bricks: [],
        fixed_bricks: [],
      });
      return newSinglePage;
    }

    const pageBricks = await CollectionBrick.getAll({
      reference_id: singlepage.rows[0].id,
      type: "singlepage",
      environment_key: data.environment_key,
      collection: collection,
    });
    singlepage.rows[0].builder_bricks = pageBricks.builder_bricks;
    singlepage.rows[0].fixed_bricks = pageBricks.fixed_bricks;

    return singlepage.rows[0];
  };
  static updateSingle: SinglePageUpdateSingle = async (data) => {
    const client = await getDBClient;

    // Used to check if we have access to the collection
    const environment = await Environment.getSingle(data.environment_key);
    const collection = await Collection.getSingle({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: "singlepage",
    });

    //
    // validate bricks
    await validateBricks({
      builder_bricks: data.builder_bricks || [],
      fixed_bricks: data.fixed_bricks || [],
      collection: collection,
      environment: environment,
    });

    // Get the singlepage
    const singlepage = await SinglePage.#getOrCreateSinglePage(
      data.environment_key,
      data.collection_key
    );

    // -------------------------------------------
    // Update/Create Bricks
    await Collection.updateBricks({
      id: singlepage.id,
      builder_bricks: data.builder_bricks || [],
      fixed_bricks: data.fixed_bricks || [],
      collection: collection,
      environment: environment,
    });

    // -------------------------------------------
    // Update the single page
    const updateSinglePage = await client.query<SinglePageT>({
      text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
      values: [data.userId, singlepage.id],
    });

    return updateSinglePage.rows[0];
  };
  // -------------------------------------------
  // Util Functions
  static #getOrCreateSinglePage = async (
    environment_key: string,
    collection_key: string
  ) => {
    try {
      const client = await getDBClient;

      // Check if the lucid_singlepages item exists, if not, create it
      const singlepage = await client.query<SinglePageT>({
        text: `SELECT * FROM lucid_singlepages WHERE environment_key = $1 AND collection_key = $2`,
        values: [environment_key, collection_key],
      });
      if (singlepage.rows.length === 0) {
        // Create the single apge
        const newSinglePage = await client.query<SinglePageT>({
          text: `INSERT INTO lucid_singlepages (environment_key, collection_key) VALUES ($1, $2) RETURNING *`,
          values: [environment_key, collection_key],
        });
        return newSinglePage.rows[0];
      } else return singlepage.rows[0];
    } catch (err) {
      throw new LucidError({
        type: "basic",
        name: "Single Page Error",
        message: "There was an error getting or creating the single page",
        status: 500,
      });
    }
  };
}
