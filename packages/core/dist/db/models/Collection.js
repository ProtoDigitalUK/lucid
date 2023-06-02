"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Collection_filterCollections;
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../services/Config"));
class Collection {
}
_a = Collection;
Collection.getAll = async (query) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances)
        return [];
    const collections = await Promise.all(collectionInstances.map((collection) => Collection.getCollectionData(collection)));
    return __classPrivateFieldGet(Collection, _a, "f", _Collection_filterCollections).call(Collection, query.filter, collections);
};
Collection.findCollection = async (key, type) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances)
        return false;
    const collection = await Promise.all(collectionInstances.map((collection) => Collection.getCollectionData(collection)));
    const found = collection.find((c) => {
        return c.key === key && c.type === type;
    });
    if (!found)
        return false;
    return true;
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
exports.default = Collection;
//# sourceMappingURL=Collection.js.map