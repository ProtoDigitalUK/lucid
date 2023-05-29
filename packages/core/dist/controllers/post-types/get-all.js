"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const PostType_1 = __importDefault(require("../../db/models/PostType"));
const body = zod_1.default.object({});
const query = zod_1.default.object({});
const params = zod_1.default.object({});
const getAll = async (req, res, next) => {
    try {
        const postTypes = await PostType_1.default.getAll();
        res.status(200).json((0, build_response_1.default)(req, {
            data: postTypes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: {
        body,
        query,
        params,
    },
    controller: getAll,
};
//# sourceMappingURL=get-all.js.map