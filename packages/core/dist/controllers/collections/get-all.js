"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Collection_1 = __importDefault(require("../../db/models/Collection"));
const collections_1 = __importDefault(require("../../schemas/collections"));
const getAll = async (req, res, next) => {
    try {
        const collections = await Collection_1.default.getAll(req.query, req.headers["lucid-environment"]);
        res.status(200).json((0, build_response_1.default)(req, {
            data: collections,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: collections_1.default.getAll,
    controller: getAll,
};
//# sourceMappingURL=get-all.js.map