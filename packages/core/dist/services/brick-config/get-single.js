"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const brick_config_1 = __importDefault(require("../brick-config"));
const getSingle = async (client, data) => {
    const builderInstances = brick_config_1.default.getBrickConfig();
    const instance = builderInstances.find((b) => b.key === data.brick_key);
    if (!instance) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const brick = brick_config_1.default.getBrickData(instance, {
        include: ["fields"],
    });
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
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map