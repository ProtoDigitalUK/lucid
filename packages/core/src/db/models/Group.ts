import z from "zod";
import client from "@db/db";
import slugify from "slugify";
// Models
import PageCategory from "@db/models/PageCategory";
import Collection from "@db/models/Collection";
import BrickData, { BrickObject } from "@db/models/BrickData";
// Serivces
import formatPage from "@services/pages/format-page";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Schema
import pagesSchema from "@schemas/pages";

// -------------------------------------------
// Types
type GroupGetSingle = (
  environment_key: string,
  collection_key: string
) => Promise<GroupT>;

type GroupUpdateSingle = (
  userId: number,
  environment_key: string,
  collection_key: string,
  bricks: Array<BrickObject>
) => Promise<GroupT>;

// -------------------------------------------
// Group
export type GroupT = {
  id: number;
  environment_key: string;
  collection_key: string;

  bricks?: Array<BrickData> | null;

  created_at: string;
  updated_at: string;
  updated_by: string;
};

export default class Group {
  // -------------------------------------------
  // Functions
  static getSingle: GroupGetSingle = async (
    environment_key,
    collection_key
  ) => {
    // Checks if we have access to the collection
    const collection = await Collection.getSingle({
      collection_key: collection_key,
      environment_key: environment_key,
      type: "group",
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

    const group = await client.query<GroupT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_groups
        ${SelectQuery.query.where}`,
      values: SelectQuery.values,
    });

    if (group.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Group Error",
        message: "We could not find the group you are looking for!",
        status: 404,
      });
    }

    const pageBricks = await BrickData.getAll(
      "group",
      "builder",
      group.rows[0].id,
      environment_key,
      collection
    );
    group.rows[0].bricks = pageBricks || [];

    return group.rows[0];
  };
  static updateSingle: GroupUpdateSingle = async (
    userId,
    environment_key,
    collection_key,
    bricks
  ) => {
    // Used to check if we have access to the collection
    await Collection.getSingle({
      collection_key: collection_key,
      environment_key: environment_key,
      type: "group",
    });

    // Get the group
    const group = await Group.#getOrCreateGroup(
      environment_key,
      collection_key
    );

    // -------------------------------------------
    // Update/Create Bricks
    const brickPromises =
      bricks.map((brick, index) =>
        BrickData.createOrUpdate(brick, index, "group", group.id)
      ) || [];
    const pageBricksIds = await Promise.all(brickPromises);

    // -------------------------------------------
    // Delete unused bricks
    await BrickData.deleteUnused("group", group.id, pageBricksIds);

    // -------------------------------------------
    // Update the group
    const updatedGroup = await client.query<GroupT>({
      text: `UPDATE lucid_groups SET updated_by = $1 WHERE id = $2 RETURNING *`,
      values: [userId, group.id],
    });

    return updatedGroup.rows[0];
  };
  // -------------------------------------------
  // Util Functions
  static #getOrCreateGroup = async (
    environment_key: string,
    collection_key: string
  ) => {
    try {
      // Check if the lucid_groups item exists, if not, create it
      const group = await client.query<GroupT>({
        text: `SELECT * FROM lucid_groups WHERE environment_key = $1 AND collection_key = $2`,
        values: [environment_key, collection_key],
      });
      if (group.rows.length === 0) {
        // Create the group
        const newGroup = await client.query<GroupT>({
          text: `INSERT INTO lucid_groups (environment_key, collection_key) VALUES ($1, $2) RETURNING *`,
          values: [environment_key, collection_key],
        });
        return newGroup.rows[0];
      } else return group.rows[0];
    } catch (err) {
      throw new LucidError({
        type: "basic",
        name: "Group Error",
        message: "There was an error getting or creating the group",
        status: 500,
      });
    }
  };
}
