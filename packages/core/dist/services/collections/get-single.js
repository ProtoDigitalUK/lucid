"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Config_1 = __importDefault(require("../../db/models/Config"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const collections_1 = __importDefault(require("../collections"));
const brick_config_1 = __importDefault(require("../brick-config"));
const getSingle = async (data) => {
    const instances = Config_1.default.collections || [];
    if (!instances) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionsF = instances.map((collection) => collections_1.default.formatCollection(collection));
    const environment = data.environment
        ? data.environment
        : await Environment_1.default.getSingle(data.environment_key);
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
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" and of type "${data.type}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionBricks = brick_config_1.default.getAllAllowedBricks({
        collection,
        environment,
    });
    collection["bricks"] = collectionBricks.collectionBricks;
    return collection;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map