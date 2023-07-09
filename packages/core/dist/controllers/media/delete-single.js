"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../../schemas/media"));
const deleteSingle = async (req, res, next) => {
    try {
        const media = await Media_1.default.deleteSingle(req.params.key);
        res.status(200).json((0, build_response_1.default)(req, {
            data: media,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_1.default.deleteSingle,
    controller: deleteSingle,
};
//# sourceMappingURL=delete-single.js.map