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
    const environment_key = data.query.filter?.environment_key;
    const collection_key = data.query.filter?.collection_key;
    let bricks = [];
    if (collection_key && environment_key) {
        const environment = await (0, service_1.default)(environments_1.default.getSingle, false, client)({
            key: environment_key,
        });
        const collection = await (0, service_1.default)(collections_1.default.getSingle, false, client)({
            collection_key: collection_key,
            environment_key: environment_key,
            environment: environment,
        });
        const allowedBricks = brick_config_1.default.getAllAllowedBricks({
            collection: collection,
            environment: environment,
        });
        bricks = allowedBricks.bricks;
    }
    else {
        const builderInstances = brick_config_1.default.getBrickConfig();
        for (const instance of builderInstances) {
            const brick = brick_config_1.default.getBrickData(instance, {
                include: ["fields"],
            });
            bricks.push(brick);
        }
    }
    if (!data.query.include?.includes("fields")) {
        bricks.forEach((brick) => {
            delete brick.fields;
        });
    }
    return bricks;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map