"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const SinglePage_js_1 = __importDefault(require("../../db/models/SinglePage.js"));
const index_js_1 = __importDefault(require("../environments/index.js"));
const index_js_2 = __importDefault(require("../collections/index.js"));
const index_js_3 = __importDefault(require("../collection-bricks/index.js"));
const index_js_4 = __importDefault(require("../single-pages/index.js"));
const updateSingle = async (client, data) => {
    const environment = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        key: data.environment_key,
    });
    const collection = await (0, service_js_1.default)(index_js_2.default.getSingle, false, client)({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
    const getSinglepage = await (0, service_js_1.default)(index_js_4.default.getSingle, false, client)({
        user_id: data.user_id,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
    });
    await (0, service_js_1.default)(index_js_3.default.validateBricks, false, client)({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    const singlepage = await SinglePage_js_1.default.updateSingle(client, {
        id: getSinglepage.id,
        user_id: data.user_id,
    });
    await (0, service_js_1.default)(index_js_3.default.updateMultiple, false, client)({
        id: singlepage.id,
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    return await (0, service_js_1.default)(index_js_4.default.getSingle, false, client)({
        user_id: data.user_id,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        include_bricks: true,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map