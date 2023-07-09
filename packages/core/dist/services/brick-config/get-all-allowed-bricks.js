"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brick_config_1 = __importDefault(require("../brick-config"));
const getAllAllowedBricks = (data) => {
    const allowedBricks = [];
    const allowedCollectionBricks = [];
    const brickConfigData = brick_config_1.default.getBrickConfig();
    for (const brick of brickConfigData) {
        const brickAllowed = brick_config_1.default.isBrickAllowed({
            key: brick.key,
            collection: data.collection,
            environment: data.environment,
        });
        if (brickAllowed.allowed && brickAllowed.brick) {
            allowedBricks.push(brickAllowed.brick);
        }
        if (brickAllowed.allowed && brickAllowed.collectionBrick) {
            if (brickAllowed.collectionBrick.builder)
                allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
            if (brickAllowed.collectionBrick.fixed)
                allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
        }
    }
    return {
        bricks: allowedBricks,
        collectionBricks: allowedCollectionBricks,
    };
};
exports.default = getAllAllowedBricks;
//# sourceMappingURL=get-all-allowed-bricks.js.map