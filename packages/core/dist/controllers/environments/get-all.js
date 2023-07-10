"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const environments_2 = __importDefault(require("../../services/environments"));
const getAllController = async (req, res, next) => {
    try {
        const environmentsRes = await environments_2.default.getAll({});
        res.status(200).json((0, build_response_1.default)(req, {
            data: environmentsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_1.default.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map