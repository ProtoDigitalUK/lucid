"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const media_js_1 = __importDefault(require("../../schemas/media.js"));
const index_js_1 = __importDefault(require("../../services/media/index.js"));
const getSingleController = async (req, res, next) => {
    try {
        const media = await (0, service_js_1.default)(index_js_1.default.getSingle, false)({
            id: parseInt(req.params.id),
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: media,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_js_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map