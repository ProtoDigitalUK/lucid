// Models
import Config from "@db/models/Config";
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
