import { LucidError } from "@utils/error-handler";
import { CollectionBuilderT } from "@lucid/collection-builder";
// Models
import Config from "@services/Config";
// Serivces

// -------------------------------------------
// Types
interface QueryParams extends ModelQueryParams {
  filter?: {
    type?: string;
  };
}

type CollectionGetAll = (query: QueryParams) => Promise<CollectionT[]>;
type CollectionVerifyType = (key: string, type: string) => Promise<boolean>;

// -------------------------------------------
// Collection
export type CollectionT = {
  key: string;

  title: string;
  singular: string;
  description: string | null;
  type: "single" | "multiple";
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

    return Collection.#filterCollections(query.filter, collections);
  };
  static findCollection: CollectionVerifyType = async (key, type) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) return false;

    const collection = await Promise.all(
      collectionInstances.map((collection) =>
        Collection.getCollectionData(collection)
      )
    );

    const found = collection.find((c) => {
      return c.key === key && c.type === type;
    });
    if (!found) return false;
    return true;
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
        default:
          break;
      }
    });

    return filtered;
  };
}
