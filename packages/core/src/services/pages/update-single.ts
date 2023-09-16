import { PoolClient } from "pg";
import z from "zod";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";

// Models
import Page from "@db/models/Page.js";
// Schema
import { BrickSchema } from "@schemas/bricks.js";
// Services
import environmentsService from "@services/environments/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";
import pageCategoryService from "@services/page-categories/index.js";
import pageServices from "@services/pages/index.js";

export interface ServiceData {
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
      parent_id: data.parent_id,
    }),
  ]);

  // If the page is a homepage, set the parent_id to undefined
  const parentId = data.homepage ? undefined : data.parent_id;
  if (parentId) {
    await service(
      pageServices.parentChecks,
      false,
      client
    )({
      parent_id: parentId,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
    });
  }

  // validate bricks
  await service(
    collectionBricksService.validateBricks,
    false,
    client
  )({
    builder_bricks: data.builder_bricks || [],
    fixed_bricks: data.fixed_bricks || [],
    collection: collection,
    environment: environment,
  });

  let newSlug = undefined;
  if (data.slug) {
    // Check if slug is unique
    newSlug = await service(
      pageServices.buildUniqueSlug,
      false,
      client
    )({
      slug: data.slug,
      homepage: data.homepage || false,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
      parent_id: parentId,
    });
  }

  // Update page
  const page = await Page.updateSingle(client, {
    id: data.id,
    environment_key: data.environment_key,
    userId: data.userId,

    title: data.title,
    slug: newSlug,
    homepage: data.homepage,
    parent_id: parentId,
    category_ids: data.category_ids,
    published: data.published,
    excerpt: data.excerpt,
    builder_bricks: data.builder_bricks,
    fixed_bricks: data.fixed_bricks,
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
    service(
      collectionBricksService.updateMultiple,
      false,
      client
    )({
      id: page.id,
      builder_bricks: data.builder_bricks || [],
      fixed_bricks: data.fixed_bricks || [],
      collection: collection,
      environment: environment,
    }),
  ]);

  return undefined;
};

export default updateSingle;
