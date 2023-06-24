"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../models/Config"));
const Collection_1 = __importDefault(require("../models/Collection"));
const Environment_1 = __importDefault(require("../models/Environment"));
const error_handler_1 = require("../../utils/error-handler");
class BrickConfig {
}
_a = BrickConfig;
BrickConfig.getSingle = async (brick_key, collection_key, environment_key) => {
    const allBricks = await BrickConfig.getAll(collection_key, environment_key, {
        include: ["fields"],
    });
    const brick = allBricks.find((b) => b.key === brick_key);
    if (!brick) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    return brick;
};
BrickConfig.getAll = async (collection_key, environment_key, query) => {
    const collection = await Collection_1.default.getSingle({
        collection_key: collection_key,
        environment_key: environment_key,
    });
    const environments = await Environment_1.default.getSingle(environment_key);
    const allowedBricks = BrickConfig.getAllAllowedBricks({
        collection: collection,
        environment: environments,
    });
    if (!query.include?.includes("fields")) {
        allowedBricks.bricks.forEach((brick) => {
            delete brick.fields;
        });
    }
    return allowedBricks.bricks;
};
BrickConfig.isBrickAllowed = (key, data, type) => {
    let allowed = false;
    const builderInstances = BrickConfig.getBrickConfig();
    const instance = builderInstances.find((b) => b.key === key);
    const envAssigned = (data.environment.assigned_bricks || [])?.includes(key);
    let collectionBrick;
    if (!type) {
        collectionBrick = data.collection.bricks?.find((b) => (b.key === key && b.type === "builder") || b.type === "fixed");
    }
    else {
        collectionBrick = data.collection.bricks?.find((b) => b.key === key && b.type === type);
    }
    if (instance && envAssigned && collectionBrick)
        allowed = true;
    let brick;
    if (instance) {
        brick = {
            key: instance.key,
            title: instance.title,
            fields: instance.fieldTree,
        };
    }
    return {
        allowed: allowed,
        brick: brick,
        collectionBrick: collectionBrick,
    };
};
BrickConfig.getAllAllowedBricks = (data) => {
    const allowedBricks = [];
    const allowedCollectionBricks = [];
    const brickConfigData = BrickConfig.getBrickConfig();
    for (const brick of brickConfigData) {
        const brickAllowed = BrickConfig.isBrickAllowed(brick.key, {
            collection: data.collection,
            environment: data.environment,
        });
        if (brickAllowed.allowed && brickAllowed.brick) {
            allowedBricks.push(brickAllowed.brick);
        }
        if (brickAllowed.allowed && brickAllowed.collectionBrick) {
            allowedCollectionBricks.push(brickAllowed.collectionBrick);
        }
    }
    return {
        bricks: allowedBricks,
        collectionBricks: allowedCollectionBricks,
    };
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
exports.default = BrickConfig;
//# sourceMappingURL=BrickConfig.js.map