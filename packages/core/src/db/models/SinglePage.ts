import client from "@db/db";
// Models
import Collection from "@db/models/Collection";
import BrickData, { BrickObject } from "@db/models/BrickData";
// Utils
import { LucidError } from "@utils/error-handler";
import { SelectQueryBuilder } from "@utils/query-helpers";

// -------------------------------------------
// Types
type SinglePageGetSingle = (
  environment_key: string,
  collection_key: string
) => Promise<SinglePageT>;

type SinglePageUpdateSingle = (
  userId: number,
  environment_key: string,
  collection_key: string,
  bricks: Array<BrickObject>
) => Promise<SinglePageT>;

// -------------------------------------------
// Single Page
export type SinglePageT = {
  id: number;
  environment_key: string;
  collection_key: string;

  bricks?: Array<BrickData> | null;

  created_at: string;
  updated_at: string;
  updated_by: string;
};

export default class SinglePage {
  // -------------------------------------------
  // Functions
  static getSingle: SinglePageGetSingle = async (
    environment_key,
    collection_key
  ) => {
    // Checks if we have access to the collection
    const collection = await Collection.getSingle({
      collection_key: collection_key,
      environment_key: environment_key,
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
          collection_key: collection_key,
          environment_key: environment_key,
        },
        meta: {
          collection_key: {
            operator: "=",
            type: "string",
            columnType: "standard",
          },
          environment_key: {
            operator: "=",
            type: "string",
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
      throw new LucidError({
        type: "basic",
        name: "Single Page Error",
        message: "We could not find the single page you are looking for!",
        status: 404,
      });
    }

    const pageBricks = await BrickData.getAll(
      "singlepage",
      "builder",
      singlepage.rows[0].id,
      environment_key,
      collection
    );
    singlepage.rows[0].bricks = pageBricks || [];

    return singlepage.rows[0];
  };
  static updateSingle: SinglePageUpdateSingle = async (
    userId,
    environment_key,
    collection_key,
    bricks
  ) => {
    // Used to check if we have access to the collection
    await Collection.getSingle({
      collection_key: collection_key,
      environment_key: environment_key,
      type: "singlepage",
    });

    // Get the singlepage
    const singlepage = await SinglePage.#getOrCreateSinglePage(
      environment_key,
      collection_key
    );

    // -------------------------------------------
    // Update/Create Bricks
    const brickPromises =
      bricks.map((brick, index) =>
        BrickData.createOrUpdate(brick, index, "singlepage", singlepage.id)
      ) || [];
    const pageBricksIds = await Promise.all(brickPromises);

    // -------------------------------------------
    // Delete unused bricks
    await BrickData.deleteUnused("singlepage", singlepage.id, pageBricksIds);

    // -------------------------------------------
    // Update the single page
    const updateSinglePage = await client.query<SinglePageT>({
      text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
      values: [userId, singlepage.id],
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
