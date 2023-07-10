"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const Config_1 = __importDefault(require("../../db/models/Config"));
const collections_1 = __importDefault(require("../collections"));
const brick_config_1 = __importDefault(require("../brick-config"));
const getAll = async (data) => {
    const instances = Config_1.default.collections || [];
    if (!instances)
        return [];
    let collectionsF = instances.map((collection) => collections_1.default.format(collection));
    const environment = await Environment_1.default.getSingle(data.environment_key);
    collectionsF.filter((collection) => environment.assigned_collections.includes(collection.key));
    collectionsF = filterCollections(data.query.filter, collectionsF);
    collectionsF = collectionsF.map((collection) => {
        const collectionData = {
            key: collection.key,
            title: collection.title,
            singular: collection.singular,
            description: collection.description,
            type: collection.type,
        };
        if (data.query.include?.includes("bricks")) {
            const collectionBricks = brick_config_1.default.getAllAllowedBricks({
                collection,
                environment,
            });
            collectionData.bricks = collectionBricks.collectionBricks;
        }
        return collectionData;
    });
    return collections_1.default;
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
exports.default = getAll;
//# sourceMappingURL=get-all.js.map