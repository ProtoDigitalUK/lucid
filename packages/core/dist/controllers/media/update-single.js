"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const media_1 = __importDefault(require("../../schemas/media"));
const media_2 = __importDefault(require("../../services/media"));
const updateSingleController = async (req, res, next) => {
    try {
        const media = await (0, service_1.default)(media_2.default.updateSingle, true)({
            id: parseInt(req.params.id),
            data: {
                name: req.body.name,
                alt: req.body.alt,
                files: req.files,
            },
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: media,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_1.default.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map