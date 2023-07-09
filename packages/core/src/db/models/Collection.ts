import z from "zod";
// Models
import Config from "@db/models/Config";
import Environment, { EnvironmentT } from "@db/models/Environment";
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrick";
// Schema
import collectionSchema from "@schemas/collections";
// Internal packages
import {
  CollectionConfigT,
  CollectionBuilderT,
} from "@lucid/collection-builder";
// Utils
import { EnvironmentResT } from "@utils/environments/format-environment";
import { LucidError } from "@utils/app/error-handler";
// Services
import brickConfig from "@services/brick-config";

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
  environment?: EnvironmentT;
}) => Promise<CollectionT>;

type CollectionUpdateBricks = (props: {
  id: number;
  builder_bricks: Array<BrickObject>;
  fixed_bricks: Array<BrickObject>;
  collection: CollectionT;
  environment: EnvironmentResT;
}) => Promise<void>;

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
        const collectionBricks = brickConfig.getAllAllowedBricks({
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

    const environment = props.environment
      ? props.environment
      : await Environment.getSingle(props.environment_key);

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

    const collectionBricks = brickConfig.getAllAllowedBricks({
      collection,
      environment,
    });
    collection["bricks"] = collectionBricks.collectionBricks;

    return collection;
  };
  static updateBricks: CollectionUpdateBricks = async (props) => {
    // -------------------------------------------
    // Update/Create Bricks
    const builderBricksPromise =
      props.builder_bricks.map((brick, index) =>
        CollectionBrick.createOrUpdate({
          reference_id: props.id,
          brick: brick,
          brick_type: "builder",
          order: index,
          environment: props.environment,
          collection: props.collection,
        })
      ) || [];
    const fixedBricksPromise =
      props.fixed_bricks.map((brick, index) =>
        CollectionBrick.createOrUpdate({
          reference_id: props.id,
          brick: brick,
          brick_type: "fixed",
          order: index,
          environment: props.environment,
          collection: props.collection,
        })
      ) || [];

    const [buildBrickRes, fixedBrickRes] = await Promise.all([
      Promise.all(builderBricksPromise),
      Promise.all(fixedBricksPromise),
    ]);

    const builderIds = buildBrickRes.map((brickId) => brickId);
    const fixedIds = fixedBrickRes.map((brickId) => brickId);

    // -------------------------------------------
    // Delete unused bricks
    if (builderIds.length > 0)
      await CollectionBrick.deleteUnused({
        type: props.collection.type,
        reference_id: props.id,
        brick_ids: builderIds,
        brick_type: "builder",
      });
    if (fixedIds.length > 0)
      await CollectionBrick.deleteUnused({
        type: props.collection.type,
        reference_id: props.id,
        brick_ids: fixedIds,
        brick_type: "fixed",
      });
  };
  // -------------------------------------------
  // Util Functions
  static getCollectionsConfig = (): CollectionBuilderT[] => {
    const collectionInstances = Config.collections;

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
