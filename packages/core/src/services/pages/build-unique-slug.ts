import { PoolClient } from "pg";
import slugify from "slugify";
// Models
import Page from "@db/models/Page";

export interface ServiceData {
  slug: string;
  homepage: boolean;
  environment_key: string;
  collection_key: string;
  parent_id?: number;
}

const buildUniqueSlug = async (client: PoolClient, data: ServiceData) => {
  // For homepage, return "/"
  if (data.homepage) {
    return "/";
  }

  // Sanitize slug with slugify
  data.slug = slugify(data.slug, { lower: true, strict: true });

  const slugCount = await Page.getSlugCount(client, {
    slug: data.slug,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: data.parent_id,
  });

  if (slugCount >= 1) {
    return `${data.slug}-${slugCount}`;
  } else {
    return data.slug;
  }
};

export default buildUniqueSlug;
