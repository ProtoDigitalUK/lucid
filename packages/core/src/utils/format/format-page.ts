import { PageT } from "@db/models/Page.js";
// Types
import type { PagesResT } from "@lucid/types/src/pages.js";

export const formatPageSlug = (slug: string | null) => {
  if (!slug) return null;
  if (!slug.startsWith("/")) slug = `/${slug}`;

  return slug;
};

const setMultiContent = (data: PageT) => {
  if (!data.language_id) return [];
  return [
    {
      title: data.title || null,
      slug: formatPageSlug(data.slug || null),
      language_id: data.language_id,
      excerpt: data.excerpt || null,
    },
  ];
};

const formatTranslations = (translations: PageT["translations"]) => {
  return translations.map((translation) => {
    return {
      title: translation.title || null,
      slug: formatPageSlug(translation.slug || null),
      language_id: translation.language_id,
      excerpt: translation.excerpt || null,
    };
  });
};

const formatPage = (data: PageT, multi_content?: boolean): PagesResT => {
  let res: PagesResT = {
    id: data.id,
    environment_key: data.environment_key,
    parent_id: data.parent_id,
    collection_key: data.collection_key,

    homepage: data.homepage,
    translations: multi_content
      ? setMultiContent(data)
      : formatTranslations(data.translations || []),

    default_title: data.default_title || null,
    default_slug: formatPageSlug(data.default_slug || null),
    default_excerpt: data.default_excerpt || null,

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
