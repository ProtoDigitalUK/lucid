"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../brick-config/index.js"));
const index_js_2 = __importDefault(require("../collections/index.js"));
const index_js_3 = __importDefault(require("../environments/index.js"));
const getAll = async (client, data) => {
    const environment_key = data.query.filter?.environment_key;
    const collection_key = data.query.filter?.collection_key;
    let bricks = [];
    if (collection_key && environment_key) {
        const environment = await (0, service_js_1.default)(index_js_3.default.getSingle, false, client)({
            key: environment_key,
        });
        const collection = await (0, service_js_1.default)(index_js_2.default.getSingle, false, client)({
            collection_key: collection_key,
            environment_key: environment_key,
            environment: environment,
        });
        const allowedBricks = index_js_1.default.getAllAllowedBricks({
            collection: collection,
            environment: environment,
        });
        bricks = allowedBricks.bricks;
    }
    else {
        const builderInstances = index_js_1.default.getBrickConfig();
        for (const instance of builderInstances) {
            const brick = index_js_1.default.getBrickData(instance, {
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