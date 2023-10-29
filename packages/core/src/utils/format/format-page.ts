import { PageT } from "@db/models/Page.js";
// Types
import type { PagesResT } from "@lucid/types/src/pages.js";

const formatPage = (data: PageT): PagesResT => {
  let res: PagesResT = {
    id: data.id,
    environment_key: data.environment_key,
    parent_id: data.parent_id,
    collection_key: data.collection_key,

    homepage: data.homepage,

    page_content: data.page_content,

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

  return res;
};

export default formatPage;
