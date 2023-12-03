import type {
  CustomField,
  BrickConfigOptionsT,
  FieldTypes,
} from "../../core/src/builders/brick-builder/index.js";
import type { CollectionBrickT } from "../../db/src/models/CollectionBrick.js";
import type { MediaTypeT } from "./media.js";

export interface BrickConfigT {
  key: string;
  title: string;
  fields?: CustomField[];
  preview?: BrickConfigOptionsT["preview"];
}

export type CustomFieldT = CustomField;
export type FieldTypesT = FieldTypes;

// Format brick

export type BrickFieldValueT =
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      [key: string]: any;
    }
  | LinkValueT
  | MediaValueT
  | PageLinkValueT;

export type BrickFieldMetaT = null | undefined | MediaMetaT | PageLinkMetaT;

export interface BrickResT {
  id: CollectionBrickT["id"];
  key: CollectionBrickT["brick_key"];
  order: CollectionBrickT["brick_order"];
  type: CollectionBrickT["brick_type"];
  groups: Array<{
    group_id: number;
    group_order: number | null;
    parent_group_id: number | null;
    repeater_key: string | null;
    language_id: number;
  }>;
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    group_id?: number | null;
    value?: BrickFieldValueT;
    meta?: BrickFieldMetaT;
    language_id: number;
  }>;
}

export interface PageLinkValueT {
  id: number | null;
  target?: string | null;
  label?: string | null;
}

export interface PageLinkMetaT {
  slug?: string;
}

export interface LinkValueT {
  url: string | null;
  target?: string | null;
  label?: string | null;
}

export type MediaValueT = number;
export interface MediaMetaT {
  id?: number;
  url?: string;
  key?: string;
  mime_type?: string;
  file_extension?: string;
  file_size?: number;
  width?: number;
  height?: number;
  name?: string;
  alt?: string;
  type?: MediaTypeT;
}
