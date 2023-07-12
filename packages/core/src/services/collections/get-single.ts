// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import { EnvironmentT } from "@db/models/Environment";
// Intenal
import { CollectionConfigT } from "@lucid/collection-builder";
// Utils
import formatCollection, {
  CollectionResT,
} from "@utils/format/format-collections";
// Services
import Config from "@services/Config";
import brickConfigService from "@services/brick-config";
import environmentsService from "@services/environments";

export interface ServiceData {
  collection_key: string;
  environment_key: string;
  type?: CollectionConfigT["type"];
  environment?: EnvironmentT;
}

const getSingle = async (data: ServiceData) => {
  // Get all instances from config
  const instances = Config.collections || [];
  if (!instances) {
    throw new LucidError({
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
    : await environmentsService.getSingle({
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
    throw new LucidError({
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
