import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Services
import collectionsService from "@services/collections/index.js";
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

  // Start checks that do not depend on each other in parallel
  const checks = Promise.all([
    service(
      collectionsService.getSingle,
      false,
      client
    )({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: "pages",
    }),
    parentId === undefined
      ? Promise.resolve(undefined) // If the page is a homepage, set the parent_id to undefined
      : service(
          pageServices.parentChecks,
          false,
          client
        )({
          parent_id: parentId,
          environment_key: data.environment_key,
          collection_key: data.collection_key,
        }),
  ]);
  await checks;

  // Check if slug is unique
  const slug = await service(
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

  // Start operations that do not depend on each other in parallel
  const operations = [
    data.category_ids
      ? service(
          pageCategoryService.createMultiple,
          false,
          client
        )({
          page_id: page.id,
          category_ids: data.category_ids,
          collection_key: data.collection_key,
        })
      : Promise.resolve(),
    data.homepage
      ? service(
          pageServices.resetHomepages,
          false,
          client
        )({
          current: page.id,
          environment_key: data.environment_key,
        })
      : Promise.resolve(),
  ];
  await Promise.all(operations);

  return undefined;
};

export default createSingle;
