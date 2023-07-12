"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_collections_1 = __importDefault(require("../../utils/format/format-collections"));
const Config_1 = __importDefault(require("../Config"));
const brick_config_1 = __importDefault(require("../brick-config"));
const environments_1 = __importDefault(require("../environments"));
const getAll = async (data) => {
    const instances = Config_1.default.collections || [];
    if (!instances)
        return [];
    let collectionsF = instances.map((collection) => (0, format_collections_1.default)(collection));
    const environment = await environments_1.default.getSingle({
        key: data.environment_key,
    });
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
exports.default = getAll;
//# sourceMappingURL=get-all.js.map