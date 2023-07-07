"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const deleteSingle = async (req, res, next) => {
    try {
        const environment = await Environment_1.default.deleteSingle(req.params.key);
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
    controller: deleteSingle,
};
//# sourceMappingURL=delete-single.js.map