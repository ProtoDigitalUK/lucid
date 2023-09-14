// Internal
import { CollectionConfigT } from "../../core/src/builders/collection-builder/index.js";

export interface CollectionResT {
  key: CollectionConfigT["key"];
  title: CollectionConfigT["title"];
  singular: CollectionConfigT["singular"];
  description: CollectionConfigT["description"];
  type: CollectionConfigT["type"];

  bricks?: CollectionConfigT["bricks"];
}

export interface CollectionPagesResT {
  id: number;
  environment_key: string;
  parent_id: number | null;
  collection_key: string;

  title: string;
  slug: string;
  full_slug: string;
  homepage: boolean;
  excerpt: string | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;

  published: boolean;
  published_at: string | null;
  published_by: number | null;

  categories?: Array<number> | null;
  builder_bricks?: Array<BrickResT> | null;
  fixed_bricks?: Array<BrickResT> | null;
}
