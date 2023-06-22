import z from "zod";
import { CollectionBuilderT } from "@lucid/collection-builder";
// Models
import Config from "@db/models/Config";
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/error-handler";
// Schema
import collectionSchema from "@schemas/collections";

// -------------------------------------------
// Types
type CollectionGetAll = (
  query: z.infer<typeof collectionSchema.getAll.query>
) => Promise<CollectionT[]>;
type CollectionVerifyType = (
  key: string,
  type: string,
  environment_key: string
) => Promise<CollectionT>;

// -------------------------------------------
// Collection
export type CollectionT = {
  key: string;

  title: string;
  singular: string;
  description: string | null;
  type: "pages" | "group";
  bricks: CollectionBuilderT["config"]["bricks"];
};

export default class Collection {
  // -------------------------------------------
  // Functions
  static getAll: CollectionGetAll = async (query) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) return [];

    let collections = await Promise.all(
      collectionInstances.map((collection) =>
        Collection.getCollectionData(collection)
      )
    );

    if (!query.filter) return collections;

    if (query.filter.environment_key) {
      const environment = await Environment.getSingle(
        query.filter.environment_key
      );
      collections = Collection.#filterEnvironmentCollections(
        environment.assigned_collections || [],
        collections
      );
    }

    return Collection.#filterCollections(query.filter, collections);
  };
  static getSingle: CollectionVerifyType = async (
    key,
    type,
    environment_key
  ) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) {
      throw new LucidError({
        type: "basic",
        name: "Collection not found",
        message: `Collection with key "${key}" and of type "${type}" under environment "${environment_key}" not found`,
        status: 404,
      });
    }

    const environment = await Environment.getSingle(environment_key);

    const collection = await Promise.all(
      collectionInstances.map((collection) =>
        Collection.getCollectionData(collection)
      )
    );

    const assignedCollections = environment.assigned_collections || [];

    const found = collection.find((c) => {
      return (
        c.key === key && c.type === type && assignedCollections.includes(c.key)
      );
    });

    if (!found) {
      throw new LucidError({
        type: "basic",
        name: "Collection not found",
        message: `Collection with key "${key}" and of type "${type}" under environment "${environment_key}" not found`,
        status: 404,
      });
    }

    return found;
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
