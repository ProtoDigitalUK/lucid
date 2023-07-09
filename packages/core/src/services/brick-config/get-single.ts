// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import brickConfig from "@services/brick-config";

export interface ServiceData {
  brick_key: string;
  collection_key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  const allBricks = await brickConfig.getAll({
    query: {
      include: ["fields"],
    },
    collection_key: data.collection_key,
    environment_key: data.environment_key,
  });

  const brick = allBricks.find((b) => b.key === data.brick_key);
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
