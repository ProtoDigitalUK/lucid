import { LucidError } from "../../utils/app/error-handler.js";
import CollectionBrick from "../../db/models/CollectionBrick.js";
const deleteUnused = async (client, data) => {
    const allBricks = await CollectionBrick.getAllBricks(client, {
        type: data.type,
        reference_id: data.reference_id,
        brick_type: data.brick_type,
    });
    const brickIds = allBricks.map((brick) => brick.id);
    const bricksToDelete = brickIds.filter((id) => !data.brick_ids.includes(id));
    const promises = bricksToDelete.map((id) => CollectionBrick.deleteSingleBrick(client, {
        brick_id: id,
    }));
    try {
        await Promise.all(promises);
    }
    catch (err) {
        throw new LucidError({
            type: "basic",
            name: "Brick Delete Error",
            message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
            status: 500,
        });
    }
};
export default deleteUnused;
//# sourceMappingURL=delete-unused.js.map