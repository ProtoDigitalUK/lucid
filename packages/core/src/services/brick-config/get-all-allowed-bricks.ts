// Models
import { EnvironmentT } from "@db/models/Environment";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Services
import brickConfigService, { BrickConfigT } from "@services/brick-config";
import { CollectionT } from "@services/collections";

export interface ServiceData {
  collection: CollectionT;
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
