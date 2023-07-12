// Services
import Config from "@services/Config";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";

const getBrickConfig = (): BrickBuilderT[] => {
  const brickInstances = Config.bricks;

  if (!brickInstances) {
    return [];
  } else {
    return brickInstances;
  }
};

export default getBrickConfig;
