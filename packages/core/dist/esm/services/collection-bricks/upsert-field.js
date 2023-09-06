import service from "../../utils/app/service.js";
import { LucidError } from "../../utils/app/error-handler.js";
import CollectionBrick from "../../db/models/CollectionBrick.js";
import collectionBricksService from "../collection-bricks/index.js";
const upsertField = async (client, data) => {
    let fieldId;
    const brickField = data.data;
    await service(collectionBricksService.checkFieldExists, false, client)({
        brick_id: data.brick_id,
        key: brickField.key,
        type: brickField.type,
        parent_repeater: brickField.parent_repeater,
        group_position: brickField.group_position,
        create: brickField.fields_id !== undefined ? false : true,
    });
    if (brickField.fields_id) {
        const fieldRes = await CollectionBrick.updateField(client, {
            brick_id: data.brick_id,
            field: brickField,
        });
        fieldId = fieldRes.fields_id;
    }
    else {
        const fieldRes = await CollectionBrick.createField(client, {
            brick_id: data.brick_id,
            field: brickField,
        });
        if (!fieldRes) {
            throw new LucidError({
                type: "basic",
                name: "Field Create Error",
                message: `Could not create field "${brickField.key}" for brick "${data.brick_id}".`,
                status: 500,
            });
        }
        fieldId = fieldRes.fields_id;
    }
    return fieldId;
};
export default upsertField;
//# sourceMappingURL=upsert-field.js.map