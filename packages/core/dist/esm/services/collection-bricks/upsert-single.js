import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import CollectionBrick from "../../db/models/CollectionBrick.js";
import brickConfigService from "../brick-config/index.js";
import collectionBricksService from "../collection-bricks/index.js";
const upsertSingleWithFields = async (client, data) => {
    const promises = [];
    const allowed = brickConfigService.isBrickAllowed({
        key: data.brick.key,
        type: data.brick_type,
        environment: data.environment,
        collection: data.collection,
    });
    if (!allowed.allowed) {
        throw new LucidError({
            type: "basic",
            name: "Brick not allowed",
            message: `The brick "${data.brick.key}" of type "${data.brick_type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
            status: 500,
        });
    }
    let brickId = data.brick.id;
    if (brickId) {
        const brickRes = await CollectionBrick.updateSingleBrick(client, {
            order: data.order,
            brick: data.brick,
            brick_type: data.brick_type,
        });
        brickId = brickRes.id;
        if (!brickRes) {
            throw new LucidError({
                type: "basic",
                name: "Page Brick Update Error",
                message: "Could not update page brick",
                status: 500,
            });
        }
    }
    else {
        const brickRes = await CollectionBrick.createSingleBrick(client, {
            type: data.collection.type,
            reference_id: data.reference_id,
            order: data.order,
            brick: data.brick,
            brick_type: data.brick_type,
        });
        brickId = brickRes.id;
        if (!brickRes) {
            throw new LucidError({
                type: "basic",
                name: "Page Brick Create Error",
                message: "Could not create page brick",
                status: 500,
            });
        }
    }
    if (!data.brick.fields)
        return brickId;
    for (const field of data.brick.fields) {
        if (field.type === "tab")
            continue;
        if (field.type === "repeater")
            promises.push(service(collectionBricksService.upsertRepeater, false, client)({
                brick_id: brickId,
                data: field,
            }));
        else
            promises.push(service(collectionBricksService.upsertField, false, client)({
                brick_id: brickId,
                data: field,
            }));
    }
    await Promise.all(promises);
    return brickId;
};
export default upsertSingleWithFields;
//# sourceMappingURL=upsert-single.js.map