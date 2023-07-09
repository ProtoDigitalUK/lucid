"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const getSingle = async (req, res, next) => {
    try {
        const environment = await Environment_1.default.getSingle(req.params.key);
        res.status(200).json((0, build_response_1.default)(req, {
            data: environment,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map