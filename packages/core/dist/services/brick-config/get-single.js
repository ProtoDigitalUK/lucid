"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const brick_config_1 = __importDefault(require("../brick-config"));
const getSingle = async (data) => {
    const allBricks = await brick_config_1.default.getAll({
        query: {
            include: ["fields"],
        },
        collection_key: data.collection_key,
        environment_key: data.environment_key,
    });
    const brick = allBricks.find((b) => b.key === data.brick_key);
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