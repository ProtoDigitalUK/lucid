import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Services
import pageServices from "@services/pages/index.js";
import pageContentServices from "@services/page-content/index.js";
import pageCategoryService from "@services/page-categories/index.js";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  homepage?: boolean;
  published?: boolean;
  parent_id?: number;
  category_ids?: number[];
  userId: number;
  translations: {
    language_id: number;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
  }[];
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

  const checkDefaultTranslationPromise = service(
    pageContentServices.checkDefaultTranslation,
    false,
    client
  )({
    translations: data.translations,
  });

  await Promise.all([
    checkPageCollectionPromise,
    parentCheckPromise,
    checkDefaultTranslationPromise,
  ]);

  // -------------------------------------------
  // Create page
  const page = await Page.createSingle(client, {
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    homepage: data.homepage,
    published: data.published,
    parent_id: parentId,
    category_ids: data.category_ids,
    userId: data.userId,
  });

  if (!page) {
    throw new HeadlessError({
      type: "basic",
      name: "Page Not Created",
      message: "There was an error creating the page",
      status: 500,
    });
  }

  // -------------------------------------------
  // Create page content
  const pageContentPromise = service(
    pageContentServices.upsertMultiple,
    false,
    client
  )({
    page_id: page.id,
    homepage: data.homepage || false,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: parentId,
    translations: data.translations,
  });

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

  await Promise.all([
    pageContentPromise,
    pageCategoryServicePromise,
    resetHomepagesPromise,
  ]);

  return undefined;
};

export default createSingle;
