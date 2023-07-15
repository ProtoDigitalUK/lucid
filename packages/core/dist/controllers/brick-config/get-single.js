"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const bricks_1 = __importDefault(require("../../schemas/bricks"));
const brick_config_1 = __importDefault(require("../../services/brick-config"));
const getSingleController = async (req, res, next) => {
    try {
        const brick = await (0, service_1.default)(brick_config_1.default.getSingle, false)({
            brick_key: req.params.brick_key,
            collection_key: req.params.collection_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: brick,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: bricks_1.default.config.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map