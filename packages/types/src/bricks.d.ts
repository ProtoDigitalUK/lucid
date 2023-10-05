import {
  CustomField,
  BrickConfigOptionsT,
  FieldTypes,
} from "../../core/src/builders/brick-builder/index.js";
import { CollectionBrickT } from "../../db/src/models/CollectionBrick.js";

export interface BrickConfigT {
  key: string;
  title: string;
  fields?: CustomField[];
  preview?: BrickConfigOptionsT["preview"];
}

export type CustomFieldT = CustomField;

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
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    repeater?: string | null;
    group?: number | null;
    value?: BrickFieldValueT;
    meta?: BrickFieldMetaT;
  }>;
}

export interface PageLinkValueT {
  id: number | null;
  target?: string | null;
  label?: string | null;
}

export interface PageLinkMetaT {
  slug?: string;
  full_slug?: string;
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
}
