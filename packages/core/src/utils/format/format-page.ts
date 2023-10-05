import { PageT } from "@db/models/Page.js";
// Types
import type { CollectionResT } from "@lucid/types/src/collections.js";
import type { PagesResT } from "@lucid/types/src/pages.js";

const formatPage = (data: PageT, collections: CollectionResT[]): PagesResT => {
  let res: PagesResT = {
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

    author: null,

    published: data.published,
    published_at: data.published_at,

    categories: data.categories,
    bricks: data.bricks,
  };

  // Author
  if (data.author_id) {
    res.author = {
      id: data.author_id,
      email: data.author_email,
      first_name: data.author_first_name,
      last_name: data.author_last_name,
      username: data.author_username,
    };
  }

  // Categories
  if (res.categories) {
    res.categories = res.categories[0] === null ? [] : res.categories;
  }
  // Full Slug
  res.full_slug = formatFullSlug(data, collections);

  return res;
};

export const formatFullSlug = (
  data: {
    full_slug?: string;
    homepage?: boolean;
    collection_key?: string;
  },
  collections: CollectionResT[]
): string => {
  let res = data.full_slug || "";

  // Full Slug
  if (res && !data.homepage) {
    // append collection path
    const collection = collections.find(
      (collection) => collection.key === data.collection_key
    );
    if (collection && collection.path) {
      res = `${collection.path}/${res}`;
    }
    // add leading slash
    if (!res.startsWith("/")) {
      res = "/" + res;
    }
    // remove double slashes
    res = res.replace(/\/+/g, "/");
  }

  return res;
};

export default formatPage;
