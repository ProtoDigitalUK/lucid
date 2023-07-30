import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import brickConfigService from "@services/brick-config";

export interface ServiceData {
  brick_key: string;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const builderInstances = brickConfigService.getBrickConfig();
  const instance = builderInstances.find((b) => b.key === data.brick_key);

  if (!instance) {
    throw new LucidError({
      type: "basic",
      name: "Brick not found",
      message: "We could not find the brick you are looking for.",
      status: 404,
    });
  }

  const brick = brickConfigService.getBrickData(instance, {
    include: ["fields"],
  });

  if (!brick) {
    throw new LucidError({
      type: "basic",
      name: "Brick not found",
      message: "We could not find the brick you are looking for.",
      status: 404,
    });
  }

  return brick;
};

export default getSingle;
