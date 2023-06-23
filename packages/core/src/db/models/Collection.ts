import z from "zod";
import { CollectionBuilderT } from "@lucid/collection-builder";
// Models
import Config from "@db/models/Config";
import Environment from "@db/models/Environment";
import BrickConfig, { BrickConfigT } from "@db/models/BrickConfig";
// Utils
import { LucidError } from "@utils/error-handler";
// Schema
import collectionSchema from "@schemas/collections";
// Internal packages
import { CollectionConfigT } from "@lucid/collection-builder";

// -------------------------------------------
// Types
type CollectionGetAll = (
  query: z.infer<typeof collectionSchema.getAll.query>,
  environment_key: string
) => Promise<CollectionT[]>;

type CollectionGetSingle = (props: {
  collection_key: CollectionConfigT["key"];
  environment_key: string;
  type?: CollectionConfigT["type"];
}) => Promise<CollectionT>;

// -------------------------------------------
// Collection
export type CollectionT = {
  key: CollectionConfigT["key"];
  title: CollectionConfigT["title"];
  singular: CollectionConfigT["singular"];
  description: CollectionConfigT["description"];
  type: CollectionConfigT["type"];

  bricks?: CollectionConfigT["bricks"];
};

export default class Collection {
  // -------------------------------------------
  // Functions
  static getAll: CollectionGetAll = async (query, environment_key) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) return [];

    let collections = collectionInstances.map((collection) =>
      Collection.getCollectionData(collection)
    );

    // Get data
    const environment = await Environment.getSingle(environment_key);

    // Filtered
    collections = Collection.#filterEnvironmentCollections(
      environment.assigned_collections || [],
      collections
    );
    collections = Collection.#filterCollections(query.filter, collections);

    const collectionsRes = collections.map((collection) => {
      const collectionData: CollectionT = {
        key: collection.key,
        title: collection.title,
        singular: collection.singular,
        description: collection.description,
        type: collection.type,
      };

      if (query.include?.includes("bricks")) {
        const collectionBricks = BrickConfig.getAllAllowedBricks({
          collection,
          environment,
        });
        collectionData.bricks = collectionBricks.collectionBricks;
      }

      return collectionData;
    });

    return collectionsRes;
  };
  static getSingle: CollectionGetSingle = async (props) => {
    // Check access
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) {
      throw new LucidError({
        type: "basic",
        name: "Collection not found",
        message: `Collection with key "${props.collection_key}" under environment "${props.environment_key}" not found`,
        status: 404,
      });
    }

    const environment = await Environment.getSingle(props.environment_key);

    const allCollections = collectionInstances.map((collection) =>
      Collection.getCollectionData(collection)
    );

    const assignedCollections = environment.assigned_collections || [];

    let collection: CollectionT | undefined;
    if (props.type) {
      collection = allCollections.find((c) => {
        return (
          c.key === props.collection_key &&
          c.type === props.type &&
          assignedCollections.includes(c.key)
        );
      });
    } else {
      collection = allCollections.find((c) => {
        return (
          c.key === props.collection_key && assignedCollections.includes(c.key)
        );
      });
    }

    if (!collection) {
      throw new LucidError({
        type: "basic",
        name: "Collection not found",
        message: `Collection with key "${props.collection_key}" and of type "${props.type}" under environment "${props.environment_key}" not found`,
        status: 404,
      });
    }

    const collectionBricks = BrickConfig.getAllAllowedBricks({
      collection,
      environment,
    });
    collection["bricks"] = collectionBricks.collectionBricks;

    return collection;
  };
  // -------------------------------------------
  // Util Functions
  static getCollectionsConfig = (): CollectionBuilderT[] => {
    const collectionInstances = Config.get().collections;

    if (!collectionInstances) {
      return [];
    } else {
      return collectionInstances;
    }
  };
  static getCollectionData = (instance: CollectionBuilderT): CollectionT => {
    const data: CollectionT = {
      key: instance.key,
      title: instance.config.title,
      singular: instance.config.singular,
      description: instance.config.description || null,
      type: instance.config.type,
      bricks: instance.config.bricks,
    };

    return data;
  };
  // -------------------------------------------
  // Query Functions
  static #filterCollections = (
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
  static #filterEnvironmentCollections = (
    environment_collections: string[],
    collections: CollectionT[]
  ) => {
    return collections.filter((collection) =>
      environment_collections.includes(collection.key)
    );
  };
}
