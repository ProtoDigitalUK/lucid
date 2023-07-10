// Models
import { EnvironmentT } from "@db/models/Environment";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Services
import brickConfig, { BrickConfigT } from "@services/brick-config";
import { CollectionT } from "@services/collections";

export interface ServiceData {
  key: string;
  collection: CollectionT;
  environment: EnvironmentT;
  type?: CollectionBrickConfigT["type"];
}

const isBrickAllowed = (data: ServiceData) => {
  // checks if the brick is allowed in the collection and environment and that there is config for it
  let allowed = false;
  const builderInstances = brickConfig.getBrickConfig();

  const instance = builderInstances.find((b) => b.key === data.key);
  const envAssigned = (data.environment.assigned_bricks || [])?.includes(
    data.key
  );

  let builderBrick: CollectionBrickConfigT | undefined;
  let fixedBrick: CollectionBrickConfigT | undefined;

  if (!data.type) {
    builderBrick = data.collection.bricks?.find(
      (b) => b.key === data.key && b.type === "builder"
    ) as CollectionBrickConfigT | undefined;

    fixedBrick = data.collection.bricks?.find(
      (b) => b.key === data.key && b.type === "fixed"
    ) as CollectionBrickConfigT | undefined;
  } else {
    const brickF = data.collection.bricks?.find(
      (b) => b.key === data.key && b.type === data.type
    ) as CollectionBrickConfigT | undefined;
    if (data.type === "builder") builderBrick = brickF;
    if (data.type === "fixed") fixedBrick = brickF;
  }

  // Set response data
  if (instance && envAssigned && (builderBrick || fixedBrick)) allowed = true;

  let brick: BrickConfigT | undefined;
  if (instance) {
    brick = brickConfig.getBrickData(instance, {
      include: ["fields"],
    });
  }

  return {
    allowed: allowed,
    brick: brick,
    collectionBrick: {
      builder: builderBrick,
      fixed: fixedBrick,
    },
  };
};

export default isBrickAllowed;
