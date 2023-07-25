import { PoolClient } from "pg";
import z from "zod";
// Schema
import collectionSchema from "@schemas/collections";
// Utils
import formatCollection from "@utils/format/format-collections";
import service from "@utils/app/service";
// Services
import Config from "@services/Config";
import brickConfigService from "@services/brick-config";
import environmentsService from "@services/environments";
// Types
import { CollectionResT } from "@lucid/types/src/collections";

export interface ServiceData {
  query: z.infer<typeof collectionSchema.getAll.query>;
  environment_key: string;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
  const instances = Config.collections || [];
  if (!instances) return [];

  // Get all collections data
  let collectionsF = instances.map((collection) =>
    formatCollection(collection)
  );
  // Get environment
  const environment = await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.environment_key,
  });

  // Filtered by assigned collections in environment
  collectionsF.filter((collection) =>
    environment.assigned_collections.includes(collection.key)
  );

  collectionsF = filterCollections(data.query.filter, collectionsF);

  collectionsF = collectionsF.map((collection) => {
    const collectionData: CollectionResT = {
      key: collection.key,
      title: collection.title,
      singular: collection.singular,
      description: collection.description,
      type: collection.type,
    };

    if (data.query.include?.includes("bricks")) {
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
