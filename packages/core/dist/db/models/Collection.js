"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Collection_filterCollections, _Collection_filterEnvrionmentCollections;
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../models/Config"));
const Environment_1 = __importDefault(require("../models/Environment"));
const error_handler_1 = require("../../utils/error-handler");
class Collection {
}
_a = Collection;
Collection.getAll = async (query) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances)
        return [];
    let collections = await Promise.all(collectionInstances.map((collection) => Collection.getCollectionData(collection)));
    if (!query.filter)
        return collections;
    if (query.filter.environment_key) {
        const environment = await Environment_1.default.getSingle(query.filter.environment_key);
        collections = __classPrivateFieldGet(Collection, _a, "f", _Collection_filterEnvrionmentCollections).call(Collection, environment.assigned_collections || [], collections);
    }
    return __classPrivateFieldGet(Collection, _a, "f", _Collection_filterCollections).call(Collection, query.filter, collections);
};
Collection.getSingle = async (key, type, environment_key) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${key}" and of type "${type}" under envrionment "${environment_key}" not found`,
            status: 404,
        });
    }
    const environment = await Environment_1.default.getSingle(environment_key);
    const collection = await Promise.all(collectionInstances.map((collection) => Collection.getCollectionData(collection)));
    const assignedCollections = environment.assigned_collections || [];
    const found = collection.find((c) => {
        return (c.key === key && c.type === type && assignedCollections.includes(c.key));
    });
    if (!found) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${key}" and of type "${type}" under envrionment "${environment_key}" not found`,
            status: 404,
        });
    }
    return found;
};
Collection.getCollectionsConfig = () => {
    const collectionInstances = Config_1.default.get().collections;
    if (!collectionInstances) {
        return [];
    }
    else {
        return collectionInstances;
    }
};
Collection.getCollectionData = (instance) => {
    const data = {
        key: instance.key,
        title: instance.config.title,
        singular: instance.config.singular,
        description: instance.config.description || null,
        type: instance.config.type,
        bricks: instance.config.bricks,
    };
    return data;
};
_Collection_filterCollections = { value: (filter, collections) => {
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
    } };
_Collection_filterEnvrionmentCollections = { value: (environment_collections, collections) => {
        return collections.filter((collection) => environment_collections.includes(collection.key));
    } };
exports.default = Collection;
//# sourceMappingURL=Collection.js.map