import { PoolClient } from "pg";
// Models
import CollectionBrick from "@db/models/CollectionBrick.js";
// Utils
import service from "@utils/app/service.js";
// Serices
import environmentsService from "@services/environments/index.js";
// Format
import formatBricks from "@utils/format/format-bricks.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";

export interface ServiceData {
  reference_id: number;
  type: CollectionResT["type"];
  environment_key: string;
  collection: CollectionResT;
  language_id: number;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
  const [brickFields, environment] = await Promise.all([
    CollectionBrick.getAll(client, {
      reference_id: data.reference_id,
      type: data.type,
      language_id: data.language_id,
    }),
    service(
      environmentsService.getSingle,
      false,
      client
    )({
      key: data.environment_key,
    }),
  ]);

  if (!brickFields) return [];

  return formatBricks({
    brick_fields: brickFields,
    environment_key: data.environment_key,
    collection: data.collection,
    environment: environment,
  });
};

export default getAll;
