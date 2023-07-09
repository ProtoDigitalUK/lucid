// Models
import Page from "@db/models/Page";

export interface ServiceData {
  environment_key: string;
  title: string;
  slug: string;
  collection_key: string;
  homepage?: boolean;
  excerpt?: string;
  published?: boolean;
  parent_id?: number;
  category_ids?: number[];
  userId: number;
}

const createSingle = async (data: ServiceData) => {
  const page = await Page.createSingle({
    environment_key: data.environment_key,
    title: data.title,
    slug: data.slug,
    collection_key: data.collection_key,
    homepage: data.homepage,
    excerpt: data.excerpt,
    published: data.published,
    parent_id: data.parent_id,
    category_ids: data.category_ids,
    userId: data.userId,
  });

  return page;
};

export default createSingle;
