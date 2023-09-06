import CollectionBrick from "../../db/models/CollectionBrick.js";
import service from "../../utils/app/service.js";
import environmentsService from "../environments/index.js";
import formatBricks from "../../utils/format/format-bricks.js";
const getAll = async (client, data) => {
    const brickFields = await CollectionBrick.getAll(client, {
        reference_id: data.reference_id,
        type: data.type,
    });
    if (!brickFields) {
        return {
            builder_bricks: [],
            fixed_bricks: [],
        };
    }
    const environment = await service(environmentsService.getSingle, false, client)({
        key: data.environment_key,
    });
    const formmatedBricks = await formatBricks({
        brick_fields: brickFields,
        environment_key: data.environment_key,
        collection: data.collection,
        environment: environment,
    });
    return {
        builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
        fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
    };
};
export default getAll;
//# sourceMappingURL=get-all.js.map