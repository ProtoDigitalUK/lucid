import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Services
import pageServices from "@services/pages/index.js";
import pageCategoryService from "@services/page-categories/index.js";

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

const createSingle = async (client: PoolClient, data: ServiceData) => {
  // If the page is a homepage, set the parent_id to undefined
  const parentId = data.homepage ? undefined : data.parent_id;

  // Parallel Checks
  const checkPageCollectionPromise = service(
    pageServices.checkPageCollection,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    homepage: data.homepage,
    parent_id: parentId,
  });

  const parentCheckPromise = parentId
    ? service(
        pageServices.parentChecks,
        false,
        client
      )({
        parent_id: parentId,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
      })
    : Promise.resolve();

  const buildUniqueSlugPromise = service(
    pageServices.buildUniqueSlug,
    false,
    client
  )({
    slug: data.slug,
    homepage: data.homepage || false,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: parentId,
  });

  // Await all parallel checks and also get the slug
  const [_, __, slug] = await Promise.all([
    checkPageCollectionPromise,
    parentCheckPromise,
    buildUniqueSlugPromise,
  ]);

  // -------------------------------------------
  // Create page
  const page = await Page.createSingle(client, {
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

  // Parallel Operations
  const pageCategoryServicePromise = data.category_ids
    ? service(
        pageCategoryService.createMultiple,
        false,
        client
      )({
        page_id: page.id,
        category_ids: data.category_ids,
        collection_key: data.collection_key,
      })
    : Promise.resolve();

  const resetHomepagesPromise = data.homepage
    ? service(
        pageServices.resetHomepages,
        false,
        client
      )({
        current: page.id,
        environment_key: data.environment_key,
      })
    : Promise.resolve();

  await Promise.all([pageCategoryServicePromise, resetHomepagesPromise]);

  return undefined;
};

export default createSingle;
