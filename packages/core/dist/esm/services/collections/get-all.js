import formatCollection from "../../utils/format/format-collections.js";
import service from "../../utils/app/service.js";
import Config from "../Config.js";
import brickConfigService from "../brick-config/index.js";
import environmentsService from "../environments/index.js";
const getAll = async (client, data) => {
    const instances = Config.collections || [];
    if (!instances)
        return [];
    let collectionsF = instances.map((collection) => formatCollection(collection));
    let environment;
    if (data.query.filter?.environment_key) {
        environment = await service(environmentsService.getSingle, false, client)({
            key: data.query.filter?.environment_key,
        });
        collectionsF = collectionsF.filter((collection) => environment?.assigned_collections.includes(collection.key));
    }
    collectionsF = filterCollections(data.query.filter, collectionsF);
    collectionsF = collectionsF.map((collection) => {
        const collectionData = {
            key: collection.key,
            title: collection.title,
            singular: collection.singular,
            description: collection.description,
            type: collection.type,
        };
        if (data.query.include?.includes("bricks") && environment) {
            const collectionBricks = brickConfigService.getAllAllowedBricks({
                collection,
                environment,
            });
            collectionData.bricks = collectionBricks.collectionBricks;
        }
        return collectionData;
    });
    return collectionsF;
};
const filterCollections = (filter, collections) => {
    if (!filter)
        return collections;
    let filtered = [...collections];
    Object.keys(filter).forEach((f) => {
        switch (f) {
            case "type":
                filtered = filtered.filter((collection) => collection.type === filter.type);
                break;
            default:
                break;
        }
    });
    return filtered;
};
export default getAll;
//# sourceMappingURL=get-all.js.map