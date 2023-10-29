import type { BrickFieldT } from "../../core/src/schemas/bricks.js";
import type { FieldTypes } from "../../core/src/builders/brick-builder/types.js";

export interface PagesResT {
  id: number;
  environment_key: string;
  parent_id: number | null;
  collection_key: string;

  title: string;
  slug: string;
  homepage: boolean;
  excerpt: string | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;

  published: boolean;
  published_at: string | null;

  author: {
    id: number | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  } | null;

  categories?: Array<number> | null;
  bricks?: Array<BrickResT> | null;
}

export type FieldTypes = FieldTypes;
