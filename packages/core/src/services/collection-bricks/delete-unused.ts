import { LucidError } from "@utils/app/error-handler";
// Models
import CollectionBrick from "@db/models/CollectionBrick";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Services
import { CollectionT } from "@services/collections";

export interface ServiceData {
  type: CollectionT["type"];
  reference_id: number;
  brick_ids: Array<number | undefined>;
  brick_type: CollectionBrickConfigT["type"];
}

const deleteUnused = async (data: ServiceData) => {
  const allBricks = await CollectionBrick.getAllBricks(
    data.type,
    data.reference_id,
    data.brick_type
  );
  const brickIds = allBricks.map((brick) => brick.id);

  // Filter out the bricks that are still in use
  const bricksToDelete = brickIds.filter((id) => !data.brick_ids.includes(id));

  // Delete the bricks
  const promises = bricksToDelete.map((id) =>
    CollectionBrick.deleteSingleBrick(id)
  );

  try {
    await Promise.all(promises);
  } catch (err) {
    throw new LucidError({
      type: "basic",
      name: "Brick Delete Error",
      message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
      status: 500,
    });
  }
};

export default deleteUnused;
