import z from "zod";
import getDBClient from "@db/db";
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

export default class Brick {}
