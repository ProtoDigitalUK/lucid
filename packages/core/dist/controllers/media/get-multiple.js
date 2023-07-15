"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const media_1 = __importDefault(require("../../schemas/media"));
const media_2 = __importDefault(require("../../services/media"));
const getMultipleController = async (req, res, next) => {
    try {
        const mediasRes = await (0, service_1.default)(media_2.default.getMultiple, false)({
            query: req.query,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: mediasRes.data,
            pagination: {
                count: mediasRes.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_1.default.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map