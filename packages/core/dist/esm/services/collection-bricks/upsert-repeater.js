import service from "../../utils/app/service.js";
import CollectionBrick from "../../db/models/CollectionBrick.js";
import collectionBricksService from "../collection-bricks/index.js";
const upsertRepeater = async (client, data) => {
    let repeaterId;
    const brickField = data.data;
    if (brickField.fields_id && brickField.group_position !== undefined) {
        const repeaterRes = await CollectionBrick.updateRepeater(client, {
            field: brickField,
        });
        repeaterId = repeaterRes.fields_id;
    }
    else {
        await service(collectionBricksService.checkFieldExists, false, client)({
            brick_id: data.brick_id,
            key: brickField.key,
            type: brickField.type,
            parent_repeater: brickField.parent_repeater,
            group_position: brickField.group_position,
            create: true,
        });
        const repeaterRes = await CollectionBrick.createRepeater(client, {
            brick_id: data.brick_id,
            field: brickField,
        });
        repeaterId = repeaterRes.fields_id;
    }
    if (!brickField.items)
        return;
    const promises = [];
    for (let i = 0; i < brickField.items.length; i++) {
        const item = brickField.items[i];
        if (item.type === "tab")
            continue;
        item.parent_repeater = repeaterId;
        if (item.type === "repeater") {
            promises.push(service(collectionBricksService.upsertRepeater, false, client)({
                brick_id: data.brick_id,
                data: item,
            }));
            continue;
        }
        promises.push(service(collectionBricksService.upsertField, false, client)({
            brick_id: data.brick_id,
            data: item,
        }));
    }
    await Promise.all(promises);
};
export default upsertRepeater;
//# sourceMappingURL=upsert-repeater.js.map