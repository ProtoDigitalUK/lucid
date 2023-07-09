"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const getAll = async (req, res, next) => {
    try {
        const environments = await Environment_1.default.getAll();
        res.status(200).json((0, build_response_1.default)(req, {
            data: environments,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_1.default.getAll,
    controller: getAll,
};
//# sourceMappingURL=get-all.js.map