"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SinglePage_1 = __importDefault(require("../../db/models/SinglePage"));
const updateSingle = async (data) => {
    const singlepage = await SinglePage_1.default.updateSingle({
        userId: data.userId,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        builder_bricks: data.builder_bricks,
        fixed_bricks: data.fixed_bricks,
    });
    return singlepage;
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map