import { PoolClient } from "pg";
import z from "zod";
// Schema
import collectionSchema from "@schemas/collections.js";
// Utils
import formatCollection from "@utils/format/format-collections.js";
import service from "@utils/app/service.js";
// Services
import Config from "@services/Config.js";
import brickConfigService from "@services/brick-config/index.js";
import environmentsService from "@services/environments/index.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
import { EnvironmentResT } from "@lucid/types/src/environments.js";

export interface ServiceData {
  query: z.infer<typeof collectionSchema.getAll.query>;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
  const instances = Config.collections || [];
  if (!instances) return [];

  // Get all collections data
  let collectionsF = instances.map((collection) =>
    formatCollection(collection)
  );

  let environment: EnvironmentResT | undefined;
  if (data.query.filter?.environment_key) {
    // Get environment
    environment = await service(
      environmentsService.getSingle,
      false,
      client
    )({
      key: data.query.filter?.environment_key,
    });

    // Filtered by assigned collections in environment
    collectionsF = collectionsF.filter((collection) =>
      environment?.assigned_collections.includes(collection.key)
    );
  }

  collectionsF = filterCollections(data.query.filter, collectionsF);

  collectionsF = collectionsF.map((collection) => {
    const collectionData: CollectionResT = {
      ...collection,
      bricks: [],
    };

    if (data.query.include?.includes("bricks") && environment) {
      const collectionBricks = brickConfigService.getAllAllowedBricks({
        collection,
        environment,
      });
      collectionData.bricks = collectionBricks.collectionBricks;
    }

    return collectionData;
  });

  return collectionsF;
};

// Filter
const filterCollections = (
  filter: z.infer<typeof collectionSchema.getAll.query>["filter"],
  collections: CollectionResT[]
): CollectionResT[] => {
  if (!filter) return collections;

  let filtered = [...collections];

  // Run each possible filter
  Object.keys(filter).forEach((f) => {
    switch (f) {
      case "type":
        filtered = filtered.filter(
          (collection) => collection.type === filter.type
        );
        break;
      default:
        break;
    }
  });

  return filtered;
};

export default getAll;
