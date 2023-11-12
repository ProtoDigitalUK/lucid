import { PoolClient } from "pg";
import slug from "slug";
// Models
import PageContent from "@db/models/PageContent.js";

export interface ServiceData {
  slug: string | null | undefined;
  homepage: boolean;
  environment_key: string;
  collection_key: string;
  parent_id?: number;
  language_id: number;
  page_id: number;
}

const buildUniqueSlug = async (client: PoolClient, data: ServiceData) => {
  // For homepage, return "/"
  if (data.homepage) {
    return "/";
  }

  if (!data.slug) {
    return null;
  }

  // Sanitize slug with slugify
  data.slug = slug(data.slug, { lower: true });

  const slugCount = await PageContent.getSlugCount(client, {
    slug: data.slug,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: data.parent_id,
    language_id: data.language_id,
    page_id: data.page_id,
  });

  if (slugCount >= 1) {
    return `${data.slug}-${slugCount}`;
  } else {
    return data.slug;
  }
};

export default buildUniqueSlug;
