"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const options_1 = __importDefault(require("../../schemas/options"));
const options_2 = __importDefault(require("../../services/options"));
const getSinglePublicController = async (req, res, next) => {
    try {
        const option = await options_2.default.getByName({
            name: req.params.name,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: option,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: options_1.default.getSinglePublic,
    controller: getSinglePublicController,
};
//# sourceMappingURL=get-single-public.js.map