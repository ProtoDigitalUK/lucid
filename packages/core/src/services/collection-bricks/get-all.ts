import { PoolClient } from "pg";
// Models
import CollectionBrick from "@db/models/CollectionBrick";
// Utils
import service from "@utils/app/service";
// Serices
import environmentsService from "@services/environments";
// Format
import { CollectionResT } from "@utils/format/format-collections";
import formatBricks from "@utils/format/format-bricks";

export interface ServiceData {
  reference_id: number;
  type: CollectionResT["type"];
  environment_key: string;
  collection: CollectionResT;
}

/*
    Get all bricks for a page, of either type "builder" or "fixed", along with all of its fields.

    Then format the bricks and fields into a format that can be used by the frontend.
*/

const getAll = async (client: PoolClient, data: ServiceData) => {
  const brickFields = await CollectionBrick.getAll(client, {
    reference_id: data.reference_id,
    type: data.type,
  });

  if (!brickFields) {
    return {
      builder_bricks: [],
      fixed_bricks: [],
    };
  }

  const environment = await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.environment_key,
  });

  const formmatedBricks = await formatBricks({
    brick_fields: brickFields,
    environment_key: data.environment_key,
    collection: data.collection,
    environment: environment,
  });

  return {
    builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
    fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
  };
};

export default getAll;
