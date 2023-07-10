"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const health_1 = __importDefault(require("../../schemas/health"));
const health_2 = __importDefault(require("../../services/health"));
const getHealthController = async (req, res, next) => {
    try {
        const healthRes = await health_2.default.getHealth({});
        res.status(200).json((0, build_response_1.default)(req, {
            data: healthRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: health_1.default.getHealth,
    controller: getHealthController,
};
//# sourceMappingURL=get-health.js.map