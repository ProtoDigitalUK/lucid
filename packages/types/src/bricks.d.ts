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
  | LinkValueT
  | MediaValueT
  | PageLinkValueT;

export interface BrickResT {
  id: CollectionBrickT["id"];
  key: CollectionBrickT["brick_key"];
  order: CollectionBrickT["brick_order"];
  type: CollectionBrickT["brick_type"];
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    value?: BrickFieldValueT;
    items?: Array<Array<BrickResT["fields"][0]>>;
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
