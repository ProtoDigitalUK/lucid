// Internal
import { CollectionConfigT } from "../../core/src/builders/collection-builder/index.js";

export interface CollectionResT extends CollectionConfigT {
  key: string;
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

  author: {
    id: number | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  } | null;

  categories?: Array<number> | null;
  builder_bricks?: Array<BrickResT> | null;
  fixed_bricks?: Array<BrickResT> | null;
}

export interface CollectionCategoriesResT {
  id: number;
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
