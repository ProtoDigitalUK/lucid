import z from "zod";
import client from "@db/db";
import { LucidError } from "@utils/error-handler";
import { FieldTypes } from "@lucid/brick-builder";
// Services
import formatBricks from "@services/bricks/format-bricks";
// Schema
import { BrickSchema, FieldSchema } from "@schemas/bricks";

// -------------------------------------------
// Types
export type BrickFieldObject = z.infer<typeof FieldSchema>;
export type BrickObject = z.infer<typeof BrickSchema>;

// Json interfaces
interface LinkJsonT {
  target: "_blank" | "_self";
}

// Methods
type BrickDataCreateOrUpdate = (
  brick: BrickObject,
  order: number,
  type: "page" | "group",
  referenceId: number
) => Promise<number>;

type BrickDataGetAll = (
  type: "page" | "group",
  referenceId: number
) => Promise<Array<any>>;

type BrickDataDeleteUnused = (
  type: "page" | "group",
  referenceId: number,
  brickIds: Array<number | undefined>
) => Promise<void>;

// -------------------------------------------
// Page Brick
export type BrickFieldsT = {
  // Page brick info
  id: number;
  brick_key: string;
  page_id: number | null;
  group_id: number | null;
  brick_order: number;

  // Fields info
  fields_id: number;
  page_brick_id: number;
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

export default class BrickData {
  // -------------------------------------------
  // Methods
  static createOrUpdate: BrickDataCreateOrUpdate = async (
    brick,
    order,
    type,
    referenceId
  ) => {
    // Create or update the page brick record
    const promises = [];

    // Create the page brick record
    const brickId = brick.id
      ? await BrickData.#updateSinglePageBrick(order, brick)
      : await BrickData.#createSinglePageBrick(type, referenceId, order, brick);

    // for each field, create or update the field, if its a repeater, create or update the repeater and items
    if (!brick.fields) return brickId;

    for (const field of brick.fields) {
      if (field.type === "tab") continue;

      if (field.type === "repeater")
        promises.push(BrickData.#upsertRepeater(brickId, field));
      else promises.push(BrickData.#upsertField(brickId, field));
    }

    await Promise.all(promises);

    return brickId;
  };
  static getAll: BrickDataGetAll = async (type, referenceId) => {
    // fetch all lucid_page_bricks for the given page/group id and order by brick_order
    // join all lucid_fields in flat structure, making sure to join page_link_id or media_id if applicable
    const referenceKey = type === "page" ? "page_id" : "group_id";

    const brickFields = await client.query<BrickFieldsT>(
      `SELECT 
        lucid_page_bricks.*,
        lucid_fields.*,
        lucid_pages.title as linked_page_title,
        lucid_pages.slug as linked_page_slug,
        lucid_pages.full_slug as linked_page_full_slug
      FROM 
        lucid_page_bricks
      LEFT JOIN 
        lucid_fields
      ON 
        lucid_page_bricks.id = lucid_fields.page_brick_id
      LEFT JOIN 
        lucid_pages
      ON 
        lucid_fields.page_link_id = lucid_pages.id
      WHERE 
        lucid_page_bricks.${referenceKey} = $1
      ORDER BY 
        lucid_page_bricks.brick_order`,
      [referenceId]
    );

    if (!brickFields.rows[0]) return [];

    return formatBricks(brickFields.rows) as any;
  };
  static deleteUnused: BrickDataDeleteUnused = async (
    type,
    referenceId,
    brickIds
  ) => {
    const referenceKey = type === "page" ? "page_id" : "group_id";

    // Fetch all bricks for the page
    const pageBrickIds = await client.query<{ id: number }>({
      text: `SELECT id FROM lucid_page_bricks WHERE ${referenceKey} = $1`,
      values: [referenceId],
    });

    // Filter out the bricks that are still in use
    const bricksToDelete = pageBrickIds.rows.filter(
      (brick) => !brickIds.includes(brick.id)
    );

    // Delete the bricks
    const promises = bricksToDelete.map((brick) =>
      client.query({
        text: `DELETE FROM lucid_page_bricks WHERE id = $1`,
        values: [brick.id],
      })
    );

    try {
      await Promise.all(promises);
    } catch (err) {
      throw new LucidError({
        type: "basic",
        name: "Brick Delete Error",
        message: `There was an error deleting bricks for "${type}" of ID "${referenceId}"!`,
        status: 500,
      });
    }
  };
  // -------------------------------------------
  // Page Brick
  static #createSinglePageBrick = async (
    type: "page" | "group",
    referenceId: number,
    order: number,
    brick: BrickObject
  ) => {
    const referenceKey = type === "page" ? "page_id" : "group_id";

    const brickRes = await client.query<{
      id: number;
    }>(
      `INSERT INTO 
        lucid_page_bricks (brick_key, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3)
      RETURNING id`,
      [brick.key, referenceId, order]
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
  static #updateSinglePageBrick = async (order: number, brick: BrickObject) => {
    const brickRes = await client.query<{
      id: number;
    }>(
      `UPDATE 
        lucid_page_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      RETURNING id`,
      [order, brick.id]
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
  static #upsertField = async (brickId: number, data: BrickFieldObject) => {
    let fieldId;

    // Check if id exists. If it does, update, else create.
    if (data.fields_id) {
      const { columns, aliases, values } =
        BrickData.#fieldTypeSpecificQueryData(brickId, data, "update");

      // Generate the SET part of the update statement
      const setStatements = columns
        .map((column, i) => `${column} = ${aliases[i]}`)
        .join(", ");

      const fieldRes = await client.query<{
        fields_id: number;
      }>({
        text: `UPDATE lucid_fields SET ${setStatements} WHERE fields_id = $${
          aliases.length + 1
        } RETURNING fields_id`,
        values: [...values, data.fields_id],
      });

      fieldId = fieldRes.rows[0].fields_id;
    } else {
      // Check if the field already exists
      const fieldExists = await BrickData.#checkFieldExists(
        brickId,
        data.key,
        data.type,
        data.parent_repeater,
        data.group_position
      );
      if (fieldExists) {
        throw new LucidError({
          type: "basic",
          name: "Field Create Error",
          message: `Could not create field "${data.key}" for page brick "${brickId}". Field already exists.`,
          status: 409,
        });
      }

      // Create the field
      const { columns, aliases, values } =
        BrickData.#fieldTypeSpecificQueryData(brickId, data, "create");

      const fieldRes = await client.query<{
        fields_id: number;
      }>({
        text: `INSERT INTO lucid_fields (${columns.join(
          ", "
        )}) VALUES (${aliases.join(", ")}) RETURNING fields_id`,
        values: values,
      });

      if (!fieldRes.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Field Create Error",
          message: `Could not create field "${data.key}" for brick "${brickId}".`,
          status: 500,
        });
      }

      fieldId = fieldRes.rows[0].fields_id;
    }

    return fieldId;
  };
  static #checkFieldExists = async (
    brickId: number,
    key: string,
    type: string,
    parent_repeater?: number,
    group_position?: number
  ) => {
    let queryText =
      "SELECT EXISTS(SELECT 1 FROM lucid_fields WHERE page_brick_id = $1 AND key = $2 AND type = $3";
    let queryValues = [brickId, key, type];

    // If parent repeater is provided, add it to the query
    if (parent_repeater !== undefined) {
      queryText += " AND parent_repeater = $4";
      queryValues.push(parent_repeater);
    }

    // If group_position is provided, add it to the query
    if (group_position !== undefined) {
      queryText += " AND group_position = $5";
      queryValues.push(group_position);
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
    brickId: number,
    data: BrickFieldObject,
    mode: "create" | "update"
  ) => {
    switch (data.type) {
      case "link": {
        if (mode === "create") {
          return BrickData.#generateQueryData(
            [
              "page_brick_id",
              "key",
              "type",
              "text_value",
              "json_value",
              "parent_repeater",
              "group_position",
            ],
            [
              brickId,
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
          return BrickData.#generateQueryData(
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
          return BrickData.#generateQueryData(
            [
              "page_brick_id",
              "key",
              "type",
              "page_link_id",
              "json_value",
              "parent_repeater",
              "group_position",
            ],
            [
              brickId,
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
          return BrickData.#generateQueryData(
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
          return BrickData.#generateQueryData(
            [
              "page_brick_id",
              "key",
              "type",
              BrickData.#valueKey(data.type),
              "parent_repeater",
              "group_position",
            ],
            [
              brickId,
              data.key,
              data.type,
              data.value,
              data.parent_repeater,
              data.group_position,
            ]
          );
        } else {
          return BrickData.#generateQueryData(
            [BrickData.#valueKey(data.type), "group_position"],
            [data.value, data.group_position]
          );
        }
      }
    }
  };
  // -------------------------------------------
  // Repeater Field
  static #upsertRepeater = async (brickId: number, data: BrickFieldObject) => {
    let repeaterId;

    // Check if id exists. If it does, update, else create.
    if (data.fields_id && data.group_position !== undefined) {
      const repeaterRes = await client.query<{ fields_id: number }>({
        text: `UPDATE lucid_fields SET group_position = $1 WHERE fields_id = $2 RETURNING fields_id`,
        values: [data.group_position, data.fields_id],
      });

      repeaterId = repeaterRes.rows[0].fields_id;
    } else {
      const repeaterExists = await BrickData.#checkFieldExists(
        brickId,
        data.key,
        data.type,
        data.parent_repeater,
        data.group_position
      );

      if (repeaterExists) {
        throw new LucidError({
          type: "basic",
          name: "Repeater Create Error",
          message: `A repeater with the same page_brick_id, key, and parent_repeater already exists.`,
          status: 409,
        });
      }

      const { columns, aliases, values } = BrickData.#generateQueryData(
        ["page_brick_id", "key", "type", "parent_repeater", "group_position"],
        [
          brickId,
          data.key,
          data.type,
          data.parent_repeater,
          data.group_position,
        ]
      );

      const repeaterRes = await client.query<{ fields_id: number }>({
        text: `INSERT INTO lucid_fields (${columns.join(
          ", "
        )}) VALUES (${aliases.join(", ")}) RETURNING fields_id`,
        values: values,
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
        promises.push(BrickData.#upsertRepeater(brickId, item));
        continue;
      }

      // Update the field
      promises.push(BrickData.#upsertField(brickId, item));
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
  static #generateQueryData = (
    columns: string[],
    values: (any | undefined)[]
  ) => {
    // Ensure columns and values have the same length
    if (columns.length !== values.length) {
      throw new Error("Columns and values arrays must have the same length");
    }

    // Filter out undefined values and their corresponding columns
    const filteredData = columns
      .map((col, i) => ({ col, val: values[i] }))
      .filter((data) => data.val !== undefined);

    const keys = filteredData.map((data) => data.col);
    const realValues = filteredData.map((data) => data.val);
    const aliases = realValues.map((_, i) => `$${i + 1}`);

    return {
      columns: keys,
      aliases: aliases,
      values: realValues,
    };
  };
}
