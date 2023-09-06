import { LucidError } from "../../utils/app/error-handler.js";
import CollectionBrick from "../../db/models/CollectionBrick.js";
const checkFieldExists = async (client, data) => {
    const repeaterExists = await CollectionBrick.checkFieldExists(client, {
        brick_id: data.brick_id,
        key: data.key,
        type: data.type,
        parent_repeater: data.parent_repeater,
        group_position: data.group_position,
    });
    if (!repeaterExists && !data.create) {
        throw new LucidError({
            type: "basic",
            name: "Field Not Found",
            message: `The field cannot be updated because it does not exist.`,
            status: 409,
        });
    }
    else if (repeaterExists && data.create) {
        throw new LucidError({
            type: "basic",
            name: "Field Already Exists",
            message: `The field cannot be created because it already exists.`,
            status: 409,
        });
    }
};
export default checkFieldExists;
//# sourceMappingURL=check-field-exists.js.map