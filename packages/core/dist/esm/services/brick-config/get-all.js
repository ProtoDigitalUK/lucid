import service from "../../utils/app/service.js";
import brickConfigService from "../brick-config/index.js";
import collectionsService from "../collections/index.js";
import environmentsService from "../environments/index.js";
const getAll = async (client, data) => {
    const environment_key = data.query.filter?.environment_key;
    const collection_key = data.query.filter?.collection_key;
    let bricks = [];
    if (collection_key && environment_key) {
        const environment = await service(environmentsService.getSingle, false, client)({
            key: environment_key,
        });
        const collection = await service(collectionsService.getSingle, false, client)({
            collection_key: collection_key,
            environment_key: environment_key,
            environment: environment,
        });
        const allowedBricks = brickConfigService.getAllAllowedBricks({
            collection: collection,
            environment: environment,
        });
        bricks = allowedBricks.bricks;
    }
    else {
        const builderInstances = brickConfigService.getBrickConfig();
        for (const instance of builderInstances) {
            const brick = brickConfigService.getBrickData(instance, {
                include: ["fields"],
            });
            bricks.push(brick);
        }
    }
    if (!data.query.include?.includes("fields")) {
        bricks.forEach((brick) => {
            delete brick.fields;
        });
    }
    return bricks;
};
export default getAll;
//# sourceMappingURL=get-all.js.map