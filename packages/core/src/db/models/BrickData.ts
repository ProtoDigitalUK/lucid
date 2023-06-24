import z from "zod";
import client from "@db/db";
import { FieldTypes } from "@lucid/brick-builder";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";
// Services
import formatBricks, { BrickResponseT } from "@services/bricks/format-bricks";
// Schema
import { BrickSchema, FieldSchema } from "@schemas/bricks";
// Models
import { CollectionT } from "@db/models/Collection";
import { EnvironmentT } from "@db/models/Environment";
import BrickConfig from "@db/models/BrickConfig";
// Internal packages
import { CollectionBrickT } from "@lucid/collection-builder";

// -------------------------------------------
// Types
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;

// Json interfaces
interface LinkJsonT {
  target: "_blank" | "_self";
}

// Methods
type BrickDataCreateOrUpdate = (data: {
  reference_id: number;
  brick: BrickObject;
  brick_type: CollectionBrickT["type"];
  order: number;
  collection_type: CollectionT["type"];
  environment: EnvironmentT;
  collection: CollectionT;
}) => Promise<number>;

type BrickDataGetAll = (data: {
  reference_id: number;
  type: CollectionT["type"];
  environment_key: string;
  collection: CollectionT;
}) => Promise<{
  builder_bricks: BrickResponseT[];
  fixed_bricks: BrickResponseT[];
}>;

type BrickDataDeleteUnused = (data: {
  type: CollectionT["type"];
  reference_id: number;
  brick_ids: Array<number | undefined>;
  brick_type: CollectionBrickT["type"];
}) => Promise<void>;

type BrickDataCreateSinglePageBrick = (data: {
  type: CollectionT["type"];
  reference_id: number;
  order: number;
  brick: BrickObject;
  brick_type: CollectionBrickT["type"];
}) => Promise<number>;

type BrickDataUpdateSinglePageBrick = (data: {
  order: number;
  brick: BrickObject;
  brick_type: CollectionBrickT["type"];
}) => Promise<number>;

type BrickDataCheckFieldExists = (data: {
  brick_id: number;
  key: string;
  type: string;
  parent_repeater?: number;
  group_position?: number;
}) => Promise<boolean>;

// -------------------------------------------
// Page Brick
export type BrickFieldsT = {
  // Page brick info
  id: number;
  brick_type: CollectionBrickT["type"];
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
  json_value: LinkJsonT | any | null;

  media_id: number | null;

  page_link_id: number | null;
  linked_page_title: string | null;
  linked_page_slug: string | null;
  linked_page_full_slug: string | null;
};

export type BrickT = {
  id: number;
  brick_type: CollectionBrickT["type"];
  brick_key: string;
  page_id: number | null;
  singlepage_id: number | null;

  brick_order: number;
};

export default class BrickData {
  // -------------------------------------------
  // Functions
  static createOrUpdate: BrickDataCreateOrUpdate = async (data) => {
    // Create or update the page brick record
    const promises = [];

    const allowed = BrickConfig.isBrickAllowed(
      data.brick.key,
      {
        environment: data.environment,
        collection: data.collection,
      },
      data.brick_type
    );
    if (!allowed.allowed) {
      throw new LucidError({
        type: "basic",
        name: "Brick not allowed",
        message: `The brick "${data.brick.key}" of type "${data.brick_type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
        status: 500,
      });
    }

    // Create the page brick record
    const brickId = data.brick.id
      ? await BrickData.#updateSinglePageBrick({
          order: data.order,
          brick: data.brick,
          brick_type: data.brick_type,
        })
      : await BrickData.#createSinglePageBrick({
          type: data.collection_type,
          reference_id: data.reference_id,
          order: data.order,
          brick: data.brick,
          brick_type: data.brick_type,
        });

    // for each field, create or update the field, if its a repeater, create or update the repeater and items
    if (!data.brick.fields) return brickId;

    for (const field of data.brick.fields) {
      if (field.type === "tab") continue;

      if (field.type === "repeater")
        promises.push(BrickData.#upsertRepeater(brickId, field));
      else promises.push(BrickData.#upsertField(brickId, field));
    }

    await Promise.all(promises);

    return brickId;
  };
  static getAll: BrickDataGetAll = async (data) => {
    // join all lucid_fields in flat structure, making sure to join page_link_id or media_id if applicable
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const brickFields = await client.query<BrickFieldsT>(
      `SELECT 
      lucid_collection_bricks.*,
        lucid_fields.*,
        lucid_pages.title as linked_page_title,
        lucid_pages.slug as linked_page_slug,
        lucid_pages.full_slug as linked_page_full_slug
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
      WHERE 
        lucid_collection_bricks.${referenceKey} = $1
      ORDER BY 
        lucid_collection_bricks.brick_order`,
      [data.reference_id]
    );

    if (!brickFields.rows[0]) {
      return {
        builder_bricks: [],
        fixed_bricks: [],
      };
    }

    const formmatedBricks = await formatBricks(
      brickFields.rows,
      data.environment_key,
      data.collection
    );

    return {
      builder_bricks: formmatedBricks.filter(
        (brick) => brick.type === "builder"
      ),
      fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
    };
  };
  static deleteUnused: BrickDataDeleteUnused = async (data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    // Fetch all bricks for the page
    const pageBrickIds = await client.query<{ id: number }>({
      text: `SELECT id FROM lucid_collection_bricks WHERE ${referenceKey} = $1 AND brick_type = $2`,
      values: [data.reference_id, data.brick_type],
    });

    // Filter out the bricks that are still in use
    const bricksToDelete = pageBrickIds.rows.filter(
      (brick) => !data.brick_ids.includes(brick.id)
    );

    // Delete the bricks
    const promises = bricksToDelete.map((brick) =>
      client.query({
        text: `DELETE FROM lucid_collection_bricks WHERE id = $1`,
        values: [brick.id],
      })
    );

    try {
      await Promise.all(promises);
    } catch (err) {
      throw new LucidError({
        type: "basic",
        name: "Brick Delete Error",
        message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
        status: 500,
      });
    }
  };
  // -------------------------------------------
  // Page Brick
  static #createSinglePageBrick: BrickDataCreateSinglePageBrick = async (
    data
  ) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";

    const brickRes = await client.query<{
      id: number;
    }>(
      `INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING id`,
      [data.brick.key, data.brick_type, data.reference_id, data.order]
    );

    if (!brickRes.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Brick Create Error",
        message: "Could not create page brick",
        status: 500,
      });
    }

    return brickRes.rows[0].id;
  };
  static #updateSinglePageBrick: BrickDataUpdateSinglePageBrick = async (
    data
  ) => {
    const brickRes = await client.query<{
      id: number;
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
      [data.order, data.brick.id, data.brick_type]
    );

    if (!brickRes.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Brick Update Error",
        message: "Could not update page brick",
        status: 500,
      });
    }

    return brickRes.rows[0].id;
  };
  // -------------------------------------------
  // Fields
  static #upsertField = async (brick_id: number, data: BrickFieldObject) => {
    let fieldId;

    // Check if id exists. If it does, update, else create.
    if (data.fields_id) {
      const { columns, aliases, values } =
        BrickData.#fieldTypeSpecificQueryData(brick_id, data, "update");

      // Generate the SET part of the update statement

      const fieldRes = await client.query<{
        fields_id: number;
      }>({
        text: `UPDATE lucid_fields SET ${
          columns.formatted.update
        } WHERE fields_id = $${aliases.value.length + 1} RETURNING fields_id`,
        values: [...values.value, data.fields_id],
      });

      fieldId = fieldRes.rows[0].fields_id;
    } else {
      // Check if the field already exists
      const fieldExists = await BrickData.#checkFieldExists({
        brick_id: brick_id,
        key: data.key,
        type: data.type,
        parent_repeater: data.parent_repeater,
        group_position: data.group_position,
      });
      if (fieldExists) {
        throw new LucidError({
          type: "basic",
          name: "Field Create Error",
          message: `Could not create field "${data.key}" for page brick "${brick_id}". Field already exists.`,
          status: 409,
        });
      }

      // Create the field
      const { columns, aliases, values } =
        BrickData.#fieldTypeSpecificQueryData(brick_id, data, "create");

      const fieldRes = await client.query<{
        fields_id: number;
      }>({
        text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING fields_id`,
        values: values.value,
      });

      if (!fieldRes.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Field Create Error",
          message: `Could not create field "${data.key}" for brick "${brick_id}".`,
          status: 500,
        });
      }

      fieldId = fieldRes.rows[0].fields_id;
    }

    return fieldId;
  };
  static #checkFieldExists: BrickDataCheckFieldExists = async (data) => {
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
  // Custom field type specific functions
  static #fieldTypeSpecificQueryData = (
    brick_id: number,
    data: BrickFieldObject,
    mode: "create" | "update"
  ) => {
    switch (data.type) {
      case "link": {
        if (mode === "create") {
          return queryDataFormat(
            [
              "collection_brick_id",
              "key",
              "type",
              "text_value",
              "json_value",
              "parent_repeater",
              "group_position",
            ],
            [
              brick_id,
              data.key,
              data.type,
              data.value,
              {
                target: data.target,
              },
              data.parent_repeater,
              data.group_position,
            ]
          );
        } else {
          return queryDataFormat(
            ["text_value", "json_value", "group_position"],
            [
              data.value,
              {
                target: data.target,
              },
              data.group_position,
            ]
          );
        }
      }
      case "pagelink": {
        if (mode === "create") {
          return queryDataFormat(
            [
              "collection_brick_id",
              "key",
              "type",
              "page_link_id",
              "json_value",
              "parent_repeater",
              "group_position",
            ],
            [
              brick_id,
              data.key,
              data.type,
              data.value,
              {
                target: data.target,
              },
              data.parent_repeater,
              data.group_position,
            ]
          );
        } else {
          return queryDataFormat(
            ["page_link_id", "json_value", "group_position"],
            [
              data.value,
              {
                target: data.target,
              },
              data.group_position,
            ]
          );
        }
      }
      default: {
        if (mode === "create") {
          return queryDataFormat(
            [
              "collection_brick_id",
              "key",
              "type",
              BrickData.#valueKey(data.type),
              "parent_repeater",
              "group_position",
            ],
            [
              brick_id,
              data.key,
              data.type,
              data.value,
              data.parent_repeater,
              data.group_position,
            ]
          );
        } else {
          return queryDataFormat(
            [BrickData.#valueKey(data.type), "group_position"],
            [data.value, data.group_position]
          );
        }
      }
    }
  };
  // -------------------------------------------
  // Repeater Field
  static #upsertRepeater = async (brick_id: number, data: BrickFieldObject) => {
    let repeaterId;

    // Check if id exists. If it does, update, else create.
    if (data.fields_id && data.group_position !== undefined) {
      const repeaterRes = await client.query<{ fields_id: number }>({
        text: `UPDATE lucid_fields SET group_position = $1 WHERE fields_id = $2 RETURNING fields_id`,
        values: [data.group_position, data.fields_id],
      });

      repeaterId = repeaterRes.rows[0].fields_id;
    } else {
      const repeaterExists = await BrickData.#checkFieldExists({
        brick_id: brick_id,
        key: data.key,
        type: data.type,
        parent_repeater: data.parent_repeater,
        group_position: data.group_position,
      });

      if (repeaterExists) {
        throw new LucidError({
          type: "basic",
          name: "Repeater Create Error",
          message: `A repeater with the same collection_brick_id, key, and parent_repeater already exists.`,
          status: 409,
        });
      }

      const { columns, aliases, values } = queryDataFormat(
        [
          "collection_brick_id",
          "key",
          "type",
          "parent_repeater",
          "group_position",
        ],
        [
          brick_id,
          data.key,
          data.type,
          data.parent_repeater,
          data.group_position,
        ]
      );

      const repeaterRes = await client.query<{ fields_id: number }>({
        text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING fields_id`,
        values: values.value,
      });

      repeaterId = repeaterRes.rows[0].fields_id;
    }

    // If it has no items, return
    if (!data.items) return;

    // For each item, create or update the repeater item and then create or update the fields for that item
    const promises = [];

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      if (item.type === "tab") continue;

      // Update item data
      item.parent_repeater = repeaterId;

      // If its a repeater, recursively call this function
      if (item.type === "repeater") {
        promises.push(BrickData.#upsertRepeater(brick_id, item));
        continue;
      }

      // Update the field
      promises.push(BrickData.#upsertField(brick_id, item));
    }

    await Promise.all(promises);
  };
  // -------------------------------------------
  // Utils
  static #valueKey = (type: BrickFieldObject["type"]) => {
    switch (type) {
      case "text":
        return "text_value";
      case "wysiwyg":
        return "text_value";
      case "image":
        return "media_id";
      case "file":
        return "media_id";
      case "number":
        return "int_value";
      case "checkbox":
        return "bool_value";
      case "select":
        return "text_value";
      case "textarea":
        return "text_value";
      case "json":
        return "json_value";
      case "pagelink":
        return "page_link_id";
      case "link":
        return "text_value";
      case "datetime":
        return "text_value";
      case "colour":
        return "text_value";
      default:
        return "text_value";
    }
  };
}
