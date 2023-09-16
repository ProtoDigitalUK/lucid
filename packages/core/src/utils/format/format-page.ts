import { PageT } from "@db/models/Page.js";
// Types
import {
  CollectionPagesResT,
  CollectionResT,
} from "@lucid/types/src/collections.js";

const formatPage = (
  data: PageT,
  collections: CollectionResT[]
): CollectionPagesResT => {
  const res: CollectionPagesResT = {
    id: data.id,
    environment_key: data.environment_key,
    parent_id: data.parent_id,
    collection_key: data.collection_key,

    title: data.title,
    slug: data.slug,
    full_slug: data.full_slug,
    homepage: data.homepage,
    excerpt: data.excerpt,

    created_by: data.created_by,
    created_at: data.created_at,
    updated_at: data.updated_at,

    published: data.published,
    published_at: data.published_at,
    published_by: data.published_by,

    categories: data.categories,
    builder_bricks: data.builder_bricks,
    fixed_bricks: data.fixed_bricks,
  };

  // Categories
  if (res.categories) {
    res.categories = res.categories[0] === null ? [] : res.categories;
  }
  // Full Slug
  if (res.full_slug && !res.homepage) {
    // append collection path
    const collection = collections.find(
      (collection) => collection.key === res.collection_key
    );
    if (collection && collection.path) {
      res.full_slug = `${collection.path}/${res.full_slug}`;
    }
    if (!res.full_slug.startsWith("/")) {
      res.full_slug = "/" + res.full_slug;
    }
    res.full_slug = res.full_slug.replace(/\/+/g, "/");
  }

  return res;
};

export default formatPage;
