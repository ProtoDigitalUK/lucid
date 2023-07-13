"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SinglePage_1 = __importDefault(require("../../db/models/SinglePage"));
const environments_1 = __importDefault(require("../environments"));
const collections_1 = __importDefault(require("../collections"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const single_pages_1 = __importDefault(require("../single-pages"));
const updateSingle = async (data) => {
    const environment = await environments_1.default.getSingle({
        key: data.environment_key,
    });
    const collection = await collections_1.default.getSingle({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
    const getSinglepage = await single_pages_1.default.getSingle({
        user_id: data.user_id,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
    });
    await collection_bricks_1.default.validateBricks({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    const singlepage = await SinglePage_1.default.updateSingle({
        id: getSinglepage.id,
        user_id: data.user_id,
    });
    await collection_bricks_1.default.updateMultiple({
        id: singlepage.id,
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    return await single_pages_1.default.getSingle({
        user_id: data.user_id,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        include_bricks: true,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map