import z from "zod";
// Schema
import collectionSchema from "@schemas/collections";
// Models
import Environment from "@db/models/Environment";
import Config from "@db/models/Config";
// Services
import collections, { CollectionT } from "@services/collections";
import brickConfig from "@services/brick-config";

export interface ServiceData {
  query: z.infer<typeof collectionSchema.getAll.query>;
  environment_key: string;
}

const getAll = async (data: ServiceData) => {
  const instances = Config.collections || [];
  if (!instances) return [];

  // Get all collections data
  let collectionsF = instances.map((collection) =>
    collections.format(collection)
  );
  // Get environment
  const environment = await Environment.getSingle(data.environment_key);

  // Filtered by assigned collections in environment
  collectionsF.filter((collection) =>
    environment.assigned_collections.includes(collection.key)
  );

  collectionsF = filterCollections(data.query.filter, collectionsF);

  collectionsF = collectionsF.map((collection) => {
    const collectionData: CollectionT = {
      key: collection.key,
      title: collection.title,
      singular: collection.singular,
      description: collection.description,
      type: collection.type,
    };

    if (data.query.include?.includes("bricks")) {
      const collectionBricks = brickConfig.getAllAllowedBricks({
        collection,
        environment,
      });
      collectionData.bricks = collectionBricks.collectionBricks;
    }

    return collectionData;
  });

  return collections;
};

// Filter
const filterCollections = (
  filter: z.infer<typeof collectionSchema.getAll.query>["filter"],
  collections: CollectionT[]
): CollectionT[] => {
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
