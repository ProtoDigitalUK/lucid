"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Collection_filterCollections, _Collection_filterEnvironmentCollections;
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../models/Config"));
const Environment_1 = __importDefault(require("../models/Environment"));
const BrickConfig_1 = __importDefault(require("../models/BrickConfig"));
const CollectionBrick_1 = __importDefault(require("../models/CollectionBrick"));
const error_handler_1 = require("../../utils/app/error-handler");
class Collection {
}
_a = Collection;
Collection.getAll = async (query, environment_key) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances)
        return [];
    let collections = collectionInstances.map((collection) => Collection.getCollectionData(collection));
    const environment = await Environment_1.default.getSingle(environment_key);
    collections = __classPrivateFieldGet(Collection, _a, "f", _Collection_filterEnvironmentCollections).call(Collection, environment.assigned_collections || [], collections);
    collections = __classPrivateFieldGet(Collection, _a, "f", _Collection_filterCollections).call(Collection, query.filter, collections);
    const collectionsRes = collections.map((collection) => {
        const collectionData = {
            key: collection.key,
            title: collection.title,
            singular: collection.singular,
            description: collection.description,
            type: collection.type,
        };
        if (query.include?.includes("bricks")) {
            const collectionBricks = BrickConfig_1.default.getAllAllowedBricks({
                collection,
                environment,
            });
            collectionData.bricks = collectionBricks.collectionBricks;
        }
        return collectionData;
    });
    return collectionsRes;
};
Collection.getSingle = async (props) => {
    const collectionInstances = Collection.getCollectionsConfig();
    if (!collectionInstances) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${props.collection_key}" under environment "${props.environment_key}" not found`,
            status: 404,
        });
    }
    const environment = props.environment
        ? props.environment
        : await Environment_1.default.getSingle(props.environment_key);
    const allCollections = collectionInstances.map((collection) => Collection.getCollectionData(collection));
    const assignedCollections = environment.assigned_collections || [];
    let collection;
    if (props.type) {
        collection = allCollections.find((c) => {
            return (c.key === props.collection_key &&
                c.type === props.type &&
                assignedCollections.includes(c.key));
        });
    }
    else {
        collection = allCollections.find((c) => {
            return (c.key === props.collection_key && assignedCollections.includes(c.key));
        });
    }
    if (!collection) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${props.collection_key}" and of type "${props.type}" under environment "${props.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionBricks = BrickConfig_1.default.getAllAllowedBricks({
        collection,
        environment,
    });
    collection["bricks"] = collectionBricks.collectionBricks;
    return collection;
};
Collection.updateBricks = async (props) => {
    const builderBricksPromise = props.builder_bricks.map((brick, index) => CollectionBrick_1.default.createOrUpdate({
        reference_id: props.id,
        brick: brick,
        brick_type: "builder",
        order: index,
        environment: props.environment,
        collection: props.collection,
    })) || [];
    const fixedBricksPromise = props.fixed_bricks.map((brick, index) => CollectionBrick_1.default.createOrUpdate({
        reference_id: props.id,
        brick: brick,
        brick_type: "fixed",
        order: index,
        environment: props.environment,
        collection: props.collection,
    })) || [];
    const [buildBrickRes, fixedBrickRes] = await Promise.all([
        Promise.all(builderBricksPromise),
        Promise.all(fixedBricksPromise),
    ]);
    const builderIds = buildBrickRes.map((brickId) => brickId);
    const fixedIds = fixedBrickRes.map((brickId) => brickId);
    if (builderIds.length > 0)
        await CollectionBrick_1.default.deleteUnused({
            type: props.collection.type,
            reference_id: props.id,
            brick_ids: builderIds,
            brick_type: "builder",
        });
    if (fixedIds.length > 0)
        await CollectionBrick_1.default.deleteUnused({
            type: props.collection.type,
            reference_id: props.id,
            brick_ids: fixedIds,
            brick_type: "fixed",
        });
};
Collection.getCollectionsConfig = () => {
    const collectionInstances = Config_1.default.collections;
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
_Collection_filterEnvironmentCollections = { value: (environment_collections, collections) => {
        return collections.filter((collection) => environment_collections.includes(collection.key));
    } };
exports.default = Collection;
//# sourceMappingURL=Collection.js.map