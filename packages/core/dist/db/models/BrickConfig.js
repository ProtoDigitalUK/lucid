"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _BrickConfig_searcBricks, _BrickConfig_filterBricks, _BrickConfig_sortBricks, _BrickConfig_filterEnvironmentBricks;
Object.defineProperty(exports, "__esModule", { value: true });
const fuse_js_1 = __importDefault(require("fuse.js"));
const error_handler_1 = require("../../utils/error-handler");
const Config_1 = __importDefault(require("../models/Config"));
const Collection_1 = __importDefault(require("./Collection"));
const Environment_1 = __importDefault(require("../models/Environment"));
class BrickConfig {
}
_a = BrickConfig;
BrickConfig.getSingle = async (environment_key, key) => {
    const brickInstance = BrickConfig.getBrickConfig();
    if (!brickInstance) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const brick = brickInstance.find((b) => b.key === key);
    if (!brick) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const environment = await Environment_1.default.getSingle(environment_key);
    if (!environment.assigned_bricks?.includes(brick.key)) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "This brick is not assigned to this environment.",
            status: 404,
        });
    }
    const brickData = BrickConfig.getBrickData(brick);
    return brickData;
};
BrickConfig.getAll = async (environment_key, query) => {
    const brickInstance = BrickConfig.getBrickConfig();
    if (!brickInstance)
        return [];
    let bricks = await Promise.all(brickInstance.map((brick) => BrickConfig.getBrickData(brick, query)));
    if (query.filter?.environment_key) {
        const environment = await Environment_1.default.getSingle(query.filter.environment_key);
        bricks = __classPrivateFieldGet(BrickConfig, _a, "f", _BrickConfig_filterEnvironmentBricks).call(BrickConfig, environment.assigned_bricks || [], bricks);
    }
    const filteredBricks = await __classPrivateFieldGet(BrickConfig, _a, "f", _BrickConfig_filterBricks).call(BrickConfig, query.filter, bricks, environment_key);
    const sortedBricks = __classPrivateFieldGet(BrickConfig, _a, "f", _BrickConfig_sortBricks).call(BrickConfig, query.sort, filteredBricks);
    return sortedBricks;
};
BrickConfig.getBrickConfig = () => {
    const brickInstances = Config_1.default.get().bricks;
    if (!brickInstances) {
        return [];
    }
    else {
        return brickInstances;
    }
};
BrickConfig.getBrickData = (instance, query) => {
    const data = {
        key: instance.key,
        title: instance.title,
    };
    if (!query)
        return data;
    if (query.include?.includes("fields"))
        data.fields = instance.fieldTree;
    return data;
};
_BrickConfig_searcBricks = { value: (query, bricks) => {
        if (!query)
            return bricks;
        const fuse = new fuse_js_1.default(bricks, {
            keys: ["title"],
            threshold: 0.3,
        });
        const searchResults = fuse.search(query);
        return searchResults.map((r) => r.item);
    } };
_BrickConfig_filterBricks = { value: async (filter, bricks, environment_key) => {
        if (!filter)
            return bricks;
        let filteredBricks = [...bricks];
        const keys = Object.keys(filter);
        if (!keys.length)
            return filteredBricks;
        const collections = await Collection_1.default.getAll({
            filter: {
                environment_key,
            },
        });
        Object.keys(filter).forEach((f) => {
            switch (f) {
                case "s":
                    const searchQuery = filter.s;
                    if (searchQuery)
                        filteredBricks = __classPrivateFieldGet(BrickConfig, _a, "f", _BrickConfig_searcBricks).call(BrickConfig, searchQuery, filteredBricks);
                    break;
                case "collection_key":
                    let collectionKeys = filter.collection_key;
                    if (collectionKeys) {
                        const permittedBricks = [];
                        if (!Array.isArray(collectionKeys)) {
                            collectionKeys = [collectionKeys];
                        }
                        collectionKeys.forEach((key) => {
                            const collection = collections.find((c) => c.key === key);
                            if (collection) {
                                permittedBricks.push(...collection.bricks);
                            }
                        });
                        filteredBricks = filteredBricks.filter((b) => permittedBricks.includes(b.key));
                    }
                    break;
                default:
                    break;
            }
        });
        return filteredBricks;
    } };
_BrickConfig_sortBricks = { value: (sort, bricks) => {
        if (!sort)
            return bricks;
        let sortedBricks = [...bricks];
        sort.forEach((s) => {
            sortedBricks = sortedBricks.sort((a, b) => {
                switch (s.key) {
                    case "name":
                        if (s.value === "asc") {
                            return a.title.localeCompare(b.title);
                        }
                        else {
                            return b.title.localeCompare(a.title);
                        }
                    default:
                        return 0;
                }
            });
        });
        return sortedBricks;
    } };
_BrickConfig_filterEnvironmentBricks = { value: (environment_bricks, bricks) => {
        if (!environment_bricks)
            return bricks;
        return bricks.filter((b) => environment_bricks.includes(b.key));
    } };
exports.default = BrickConfig;
//# sourceMappingURL=BrickConfig.js.map