import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Services
import environmentsService from "@services/environments/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";
import pageCategoryService from "@services/page-categories/index.js";
import pageServices from "@services/pages/index.js";

export interface ServiceData {
  id: number;
  environment_key: string;

  title?: string;
  slug?: string;
  homepage?: boolean;
  parent_id?: number | null;
  author_id?: number | null;
  category_ids?: number[];
  published?: boolean;
  excerpt?: string;
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

  // Check if the page is a parent of itself
  if (currentPage.id === data.parent_id) {
    throw new LucidError({
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

  // Start checks that do not depend on each other in parallel
  const [environment, collection] = await Promise.all([
    service(
      environmentsService.getSingle,
      false,
      client
    )({
      key: data.environment_key,
    }),
    service(
      pageServices.checkPageCollection,
      false,
      client
    )({
      collection_key: currentPage.collection_key,
      environment_key: data.environment_key,
      homepage: data.homepage,
      parent_id: data.parent_id || undefined,
    }),
  ]);

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

  let newSlug = undefined;
  if (data.slug) {
    // Check if slug is unique
    newSlug = await service(
      pageServices.buildUniqueSlug,
      false,
      client
    )({
      slug: data.slug,
      homepage: data.homepage || currentPage.homepage,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
      parent_id: parentId || undefined,
    });
  }

  // Update page
  const page = await Page.updateSingle(client, {
    id: data.id,
    environment_key: data.environment_key,

    title: data.title,
    slug: newSlug,
    homepage: data.homepage,
    parent_id: parentId,
    category_ids: data.category_ids,
    published: data.published,
    author_id: data.author_id,
    excerpt: data.excerpt,
  });

  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Updated",
      message: "There was an error updating the page",
      status: 500,
    });
  }

  // Update categories and bricks
  await Promise.all([
    data.category_ids
      ? service(
          pageCategoryService.updateMultiple,
          false,
          client
        )({
          page_id: page.id,
          category_ids: data.category_ids,
          collection_key: currentPage.collection_key,
        })
      : Promise.resolve(),
  ]);

  return undefined;
};

export default updateSingle;
