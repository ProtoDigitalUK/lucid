"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const bricks_js_1 = __importDefault(require("../../schemas/bricks.js"));
const index_js_1 = __importDefault(require("../../services/brick-config/index.js"));
const getSingleController = async (req, res, next) => {
    try {
        const brick = await (0, service_js_1.default)(index_js_1.default.getSingle, false)({
            brick_key: req.params.brick_key,
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: brick,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: bricks_js_1.default.config.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map