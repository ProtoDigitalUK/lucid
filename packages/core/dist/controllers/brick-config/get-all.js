"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const bricks_1 = __importDefault(require("../../schemas/bricks"));
const brick_config_1 = __importDefault(require("../../services/brick-config"));
const getAllController = async (req, res, next) => {
    try {
        const bricks = await (0, service_1.default)(brick_config_1.default.getAll, false)({
            query: req.query,
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