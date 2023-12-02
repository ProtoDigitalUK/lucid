import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import { EnvironmentT } from "@db/models/Environment.js";
// Intenal
import { CollectionConfigT } from "@builders/collection-builder/index.js";
// Utils
import formatCollection from "@utils/format/format-collections.js";
// Services
import Config from "@services/Config.js";
import brickConfigService from "@services/brick-config/index.js";
// Types
import { CollectionResT } from "@headless/types/src/collections.js";
import environmentsService from "@services/environments/index.js";

export interface ServiceData {
  collection_key: string;
  environment_key: string;
  type?: CollectionConfigT["type"];
  environment?: EnvironmentT;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  // Get all instances from config
  const instances = Config.collections || [];
  if (!instances) {
    throw new HeadlessError({
      type: "basic",
      name: "Collection not found",
      message: `Collection with key "${data.collection_key}" under environment "${data.environment_key}" not found`,
      status: 404,
    });
  }

  // Format collections
  const collectionsF = instances.map((collection) =>
    formatCollection(collection)
  );

  // get environment
  const environment = data.environment
    ? data.environment
    : await service(
        environmentsService.getSingle,
        false,
        client
      )({
        key: data.environment_key,
      });
  const assignedCollections = environment.assigned_collections || [];

  // Filter by key and type
  let collection: CollectionResT | undefined;
  if (data.type) {
    collection = collectionsF.find((c) => {
      return (
        c.key === data.collection_key &&
        c.type === data.type &&
        assignedCollections.includes(c.key)
      );
    });
  } else {
    collection = collectionsF.find((c) => {
      return (
        c.key === data.collection_key && assignedCollections.includes(c.key)
      );
    });
  }
  if (!collection) {
    throw new HeadlessError({
      type: "basic",
      name: "Collection not found",
      message: `Collection with key "${data.collection_key}" and of type "${data.type}" under environment "${data.environment_key}" not found`,
      status: 404,
    });
  }

  // Get bricks
  const collectionBricks = brickConfigService.getAllAllowedBricks({
    collection,
    environment,
  });
  collection["bricks"] = collectionBricks.collectionBricks;

  return collection;
};

export default getSingle;
