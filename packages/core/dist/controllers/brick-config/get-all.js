"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const bricks_1 = __importDefault(require("../../schemas/bricks"));
const brick_config_1 = __importDefault(require("../../services/brick-config"));
const getAllController = async (req, res, next) => {
    try {
        const bricks = await brick_config_1.default.getAll({
            query: req.query,
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
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map