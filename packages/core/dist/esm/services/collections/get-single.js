import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import formatCollection from "../../utils/format/format-collections.js";
import Config from "../Config.js";
import brickConfigService from "../brick-config/index.js";
import environmentsService from "../environments/index.js";
const getSingle = async (client, data) => {
    const instances = Config.collections || [];
    if (!instances) {
        throw new LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionsF = instances.map((collection) => formatCollection(collection));
    const environment = data.environment
        ? data.environment
        : await service(environmentsService.getSingle, false, client)({
            key: data.environment_key,
        });
    const assignedCollections = environment.assigned_collections || [];
    let collection;
    if (data.type) {
        collection = collectionsF.find((c) => {
            return (c.key === data.collection_key &&
                c.type === data.type &&
                assignedCollections.includes(c.key));
        });
    }
    else {
        collection = collectionsF.find((c) => {
            return (c.key === data.collection_key && assignedCollections.includes(c.key));
        });
    }
    if (!collection) {
        throw new LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" and of type "${data.type}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionBricks = brickConfigService.getAllAllowedBricks({
        collection,
        environment,
    });
    collection["bricks"] = collectionBricks.collectionBricks;
    return collection;
};
export default getSingle;
//# sourceMappingURL=get-single.js.map