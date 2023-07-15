"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const pages_1 = __importDefault(require("../../schemas/pages"));
const pages_2 = __importDefault(require("../../services/pages"));
const deleteSingleController = async (req, res, next) => {
    try {
        const page = await (0, service_1.default)(pages_2.default.deleteSingle, true)({
            id: parseInt(req.params.id),
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_1.default.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map