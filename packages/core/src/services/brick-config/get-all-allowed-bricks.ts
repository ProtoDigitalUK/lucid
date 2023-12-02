// Models
import { EnvironmentT } from "@db/models/Environment.js";
// Internal packages
import { CollectionBrickConfigT } from "@builders/collection-builder/index.js";
// Services
import brickConfigService from "@services/brick-config/index.js";
// Types
import { CollectionResT } from "@headless/types/src/collections.js";
import { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
  collection: CollectionResT;
  environment: EnvironmentT;
}

const getAllAllowedBricks = (data: ServiceData) => {
  const allowedBricks: BrickConfigT[] = [];
  const allowedCollectionBricks: CollectionBrickConfigT[] = [];
  const brickConfigData = brickConfigService.getBrickConfig();

  for (const brick of brickConfigData) {
    const brickAllowed = brickConfigService.isBrickAllowed({
      key: brick.key,
      collection: data.collection,
      environment: data.environment,
    });

    if (brickAllowed.allowed && brickAllowed.brick) {
      allowedBricks.push(brickAllowed.brick);
    }
    if (brickAllowed.allowed && brickAllowed.collectionBrick) {
      if (brickAllowed.collectionBrick.builder)
        allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
      if (brickAllowed.collectionBrick.fixed)
        allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
    }
  }
  return {
    bricks: allowedBricks,
    collectionBricks: allowedCollectionBricks,
  };
};

export default getAllAllowedBricks;
