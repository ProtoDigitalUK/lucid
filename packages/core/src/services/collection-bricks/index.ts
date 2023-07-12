// Internal packages
import { FieldTypes } from "@lucid/brick-builder";
import { CollectionBrickT } from "@db/models/CollectionBrick";
// Services
import formatBricks from "./format-bricks";
import validateBricks from "./validate-bricks";
import updateMultiple from "./update-multiple";
import upsertSingle from "./upsert-single";
import upsertRepeater from "./upsert-repeater";
import checkFieldExists from "./check-field-exists";
import upsertField from "./upsert-field";
import getAll from "./get-all";
import deleteUnused from "./delete-unused";

// ------------------------------------
// Types
export interface BrickResponseT {
  id: CollectionBrickT["id"];
  key: CollectionBrickT["brick_key"];
  order: CollectionBrickT["brick_order"];
  type: CollectionBrickT["brick_type"];
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    value?:
      | string
      | number
      | boolean
      | null
      | LinkValueT
      | MediaValueT
      | PageLinkValueT;
    items?: Array<Array<BrickResponseT["fields"][0]>>;
  }>;
}

export interface PageLinkValueT {
  id: number;
  target?: "_blank" | "_self";
  title?: string;
  slug?: string;
  full_slug?: string;
}

export interface LinkValueT {
  target?: "_blank" | "_self";
  url?: string;
}

export interface MediaValueT {
  id: number;
  url?: string;
  key?: string;
  mime_type?: string;
  file_extension?: string;
  file_size?: number;
  width?: number;
  height?: number;
  name?: string;
  alt?: string;
}

// ------------------------------------
// Exports
export default {
  formatBricks,
  validateBricks,
  updateMultiple,
  upsertSingle,
  upsertRepeater,
  checkFieldExists,
  upsertField,
  getAll,
  deleteUnused,
};
