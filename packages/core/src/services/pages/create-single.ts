// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Page from "@db/models/Page";
// Services
import collectionsService from "@services/collections";
import pageServices from "@services/pages";
import pageCategoryService from "@services/page-categories";
// Format
import formatPage from "@utils/format/format-page";

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
  // If the page is a homepage, set the parent_id to undefined
  const parentId = data.homepage ? undefined : data.parent_id;

  // Start checks that do not depend on each other in parallel
  const checks = Promise.all([
    collectionsService.getSingle({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: "pages",
    }),
    parentId === undefined
      ? Promise.resolve(undefined) // If the page is a homepage, set the parent_id to undefined
      : pageServices.parentChecks({
          parent_id: parentId,
          environment_key: data.environment_key,
          collection_key: data.collection_key,
        }),
  ]);
  await checks;

  // Check if slug is unique
  const slug = await pageServices.buildUniqueSlug({
    slug: data.slug,
    homepage: data.homepage || false,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: parentId,
  });

  // -------------------------------------------
  // Create page
  const page = await Page.createSingle({
    environment_key: data.environment_key,
    title: data.title,
    slug: slug,
    collection_key: data.collection_key,
    homepage: data.homepage,
    excerpt: data.excerpt,
    published: data.published,
    parent_id: parentId,
    category_ids: data.category_ids,
    userId: data.userId,
  });

  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Created",
      message: "There was an error creating the page",
      status: 500,
    });
  }

  // Start operations that do not depend on each other in parallel
  const operations = [
    data.category_ids
      ? pageCategoryService.createMultiple({
          page_id: page.id,
          category_ids: data.category_ids,
          collection_key: data.collection_key,
        })
      : Promise.resolve(),
    data.homepage
      ? pageServices.resetHomepages({
          current: page.id,
          environment_key: data.environment_key,
        })
      : Promise.resolve(),
  ];
  await Promise.all(operations);

  return formatPage(page);
};

export default createSingle;
