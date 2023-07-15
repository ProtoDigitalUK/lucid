"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const environments_2 = __importDefault(require("../../services/environments"));
const deleteSingleController = async (req, res, next) => {
    try {
        const environment = await (0, service_1.default)(environments_2.default.deleteSingle, true)({
            key: req.params.key,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: environment,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_1.default.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map