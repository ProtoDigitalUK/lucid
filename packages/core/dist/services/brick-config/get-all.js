"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const brick_config_1 = __importDefault(require("../brick-config"));
const collections_1 = __importDefault(require("../collections"));
const environments_1 = __importDefault(require("../environments"));
const getAll = async (client, data) => {
    const environment = await (0, service_1.default)(environments_1.default.getSingle, false, client)({
        key: data.environment_key,
    });
    const collection = await (0, service_1.default)(collections_1.default.getSingle, false, client)({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        environment: environment,
    });
    const allowedBricks = brick_config_1.default.getAllAllowedBricks({
        collection: collection,
        environment: environment,
    });
    if (!data.query.include?.includes("fields")) {
        allowedBricks.bricks.forEach((brick) => {
            delete brick.fields;
        });
    }
    return allowedBricks.bricks;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map