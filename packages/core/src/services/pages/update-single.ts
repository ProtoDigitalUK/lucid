import z from "zod";
// Models
import Page from "@db/models/Page";
// Schema
import { BrickSchema } from "@schemas/bricks";

interface ServiceData {
  id: number;
  environment_key: string;
  userId: number;

  title?: string;
  slug?: string;
  homepage?: boolean;
  parent_id?: number;
  category_ids?: number[];
  published?: boolean;
  excerpt?: string;
  builder_bricks?: z.infer<typeof BrickSchema>[];
  fixed_bricks?: z.infer<typeof BrickSchema>[];
}

const updateSingle = async (data: ServiceData) => {
  const page = await Page.updateSingle({
    id: data.id,
    environment_key: data.environment_key,
    userId: data.userId,

    title: data.title,
    slug: data.slug,
    homepage: data.homepage,
    parent_id: data.parent_id,
    category_ids: data.category_ids,
    published: data.published,
    excerpt: data.excerpt,
    builder_bricks: data.builder_bricks,
    fixed_bricks: data.fixed_bricks,
  });
  return page;
};

export default updateSingle;
