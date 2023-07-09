"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const health_1 = __importDefault(require("../../schemas/health"));
const getHealth = async (req, res, next) => {
    try {
        res.status(200).json((0, build_response_1.default)(req, {
            data: {
                api: "ok",
                db: "ok",
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: health_1.default.getHealth,
    controller: getHealth,
};
//# sourceMappingURL=get-health.js.map