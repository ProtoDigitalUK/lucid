import { CollectionBuilderT } from "@lucid/collection-builder";
// Models
import Config from "@db/models/Config";
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/error-handler";

// -------------------------------------------
// Types
interface QueryParams extends ModelQueryParams {
  filter?: {
    type?: string;
    environment_key?: string;
    environment_collections?: Array<string>;
  };
}

type CollectionGetAll = (query: QueryParams) => Promise<CollectionT[]>;
type CollectionVerifyType = (
  key: string,
  type: string,
  environment_key: string
) => Promise<void>;

// -------------------------------------------
// Collection
export type CollectionT = {
  key: string;

  title: string;
  singular: string;
  description: string | null;
  type: "pages" | "group";
  bricks: Array<string>;
};

export default class Collection {
  // -------------------------------------------
  // Methods
  static getAll: CollectionGetAll = async (query) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) return [];

    const collections = await Promise.all(
      collectionInstances.map((collection) =>
        Collection.getCollectionData(collection)
      )
    );

    if (!query.filter) return collections;

    if (query.filter.environment_key) {
      const environment = await Environment.getSingle(
        query.filter.environment_key
      );
      query.filter.environment_collections =
        environment.assigned_collections || [];
    }

    return Collection.#filterCollections(query.filter, collections);
  };
  static findCollection: CollectionVerifyType = async (
    key,
    type,
    environment_key
  ) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) {
      throw new LucidError({
        type: "basic",
        name: "Collection not found",
        message: `Collection with key "${key}" and of type "${type}" under envrionment "${environment_key}" not found`,
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
        message: `Collection with key "${key}" and of type "${type}" under envrionment "${environment_key}" not found`,
        status: 404,
      });
    }
  };

  // -------------------------------------------
  // Util Methods
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
  // Query Methods
  static #filterCollections = (
    filter: QueryParams["filter"],
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
        case "environment_collections":
          // only return collections that are assigned to the environment
          filtered = filtered.filter((collection) =>
            filter.environment_collections?.includes(collection.key)
          );
          break;
        default:
          break;
      }
    });

    return filtered;
  };
}
