"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brick_config_1 = __importDefault(require("../brick-config"));
const isBrickAllowed = (data) => {
    let allowed = false;
    const builderInstances = brick_config_1.default.getBrickConfig();
    const instance = builderInstances.find((b) => b.key === data.key);
    const envAssigned = (data.environment.assigned_bricks || [])?.includes(data.key);
    let builderBrick;
    let fixedBrick;
    if (!data.type) {
        builderBrick = data.collection.bricks?.find((b) => b.key === data.key && b.type === "builder");
        fixedBrick = data.collection.bricks?.find((b) => b.key === data.key && b.type === "fixed");
    }
    else {
        const brickF = data.collection.bricks?.find((b) => b.key === data.key && b.type === data.type);
        if (data.type === "builder")
            builderBrick = brickF;
        if (data.type === "fixed")
            fixedBrick = brickF;
    }
    if (instance && envAssigned && (builderBrick || fixedBrick))
        allowed = true;
    let brick;
    if (instance) {
        brick = brick_config_1.default.getBrickData(instance, {
            include: ["fields"],
        });
    }
    return {
        allowed: allowed,
        brick: brick,
        collectionBrick: {
            builder: builderBrick,
            fixed: fixedBrick,
        },
    };
};
exports.default = isBrickAllowed;
//# sourceMappingURL=is-brick-allowed.js.map