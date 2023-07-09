"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../../schemas/media"));
const getMultiple = async (req, res, next) => {
    try {
        const medias = await Media_1.default.getMultiple(req.query);
        res.status(200).json((0, build_response_1.default)(req, {
            data: medias.data,
            pagination: {
                count: medias.count,
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
    controller: getMultiple,
};
//# sourceMappingURL=get-multiple.js.map