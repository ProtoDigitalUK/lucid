"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
const bricks_1 = __importDefault(require("../../schemas/bricks"));
const getAll = async (req, res, next) => {
    try {
        const bricks = await BrickConfig_1.default.getAll(req.query, {
            collection_key: req.params.collection_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: bricks,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: bricks_1.default.config.getAll,
    controller: getAll,
};
//# sourceMappingURL=get-all.js.map