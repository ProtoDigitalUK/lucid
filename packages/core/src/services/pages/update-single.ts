import { PoolClient } from "pg";
// Utils
import { HeadlessError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Types
import type { BrickObject } from "@db/models/CollectionBrick.js";
// Services
import pageCategoryService from "@services/page-categories/index.js";
import pageServices from "@services/pages/index.js";
import pageContentServices from "@services/page-content/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";

export interface ServiceData {
  id: number;
  environment_key: string;

  homepage?: boolean;
  parent_id?: number | null;
  author_id?: number | null;
  category_ids?: number[];
  published?: boolean;

  translations?: {
    language_id: number;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
  }[];
  bricks?: Array<BrickObject>;
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  // -------------------------------------------
  // Checks
  const currentPage = await service(
    pageServices.checkPageExists,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key,
  });
  const homepage =
    (data.homepage === undefined ? currentPage.homepage : data.homepage) ||
    false;

  await service(
    pageContentServices.checkDefaultTranslation,
    false,
    client
  )({
    translations: data.translations || [],
    homepage: homepage,
  });

  // Check if the page is a parent of itself
  if (currentPage.id === data.parent_id) {
    throw new HeadlessError({
      type: "basic",
      name: "Page Not Updated",
      message: "A page cannot be its own parent",
      status: 400,
      errors: modelErrors({
        parent_id: {
          code: "invalid",
          message: `A page cannot be its own parent`,
        },
      }),
    });
  }

  // If the page is a homepage, set the parent_id to undefined
  const parentId = data.homepage ? undefined : data.parent_id;
  if (parentId) {
    const parentChecks = service(
      pageServices.parentChecks,
      false,
      client
    )({
      parent_id: parentId,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
    });
    const ancestryChecks = service(
      pageServices.checkParentAncestry,
      false,
      client
    )({
      page_id: data.id,
      parent_id: parentId,
    });
    await Promise.all([parentChecks, ancestryChecks]);
  }

  const upsertContentPromise = service(
    pageContentServices.upsertMultiple,
    false,
    client
  )({
    page_id: data.id,
    environment_key: data.environment_key,
    collection_key: currentPage.collection_key,
    homepage: homepage,
    parent_id: parentId || undefined,
    translations: data.translations || [],
  });

  const pagePromise = Page.updateSingle(client, {
    id: data.id,
    environment_key: data.environment_key,
    homepage: data.homepage,
    parent_id: parentId,
    category_ids: data.category_ids,
    published: data.published,
    author_id: data.author_id,
  });

  const updateCategoriesPromise = data.category_ids
    ? service(
        pageCategoryService.updateMultiple,
        false,
        client
      )({
        page_id: currentPage.id,
        category_ids: data.category_ids,
        collection_key: currentPage.collection_key,
      })
    : Promise.resolve();

  let updatePageBricks = Promise.resolve();
  if (data.bricks) {
    updatePageBricks = service(
      collectionBricksService.updateMultiple,
      true
    )({
      id: currentPage.id,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
      bricks: data.bricks,
      type: "pages",
    });
  }

  const [page] = await Promise.all([
    pagePromise,
    upsertContentPromise,
    updateCategoriesPromise,
    updatePageBricks,
  ]);

  if (!page) {
    throw new HeadlessError({
      type: "basic",
      name: "Page Not Updated",
      message: "There was an error updating the page",
      status: 500,
    });
  }

  return undefined;
};

export default updateSingle;
