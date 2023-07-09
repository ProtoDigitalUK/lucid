"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const pages_1 = __importDefault(require("../../schemas/pages"));
const pages_2 = __importDefault(require("../../services/pages"));
const getSingleController = async (req, res, next) => {
    try {
        const page = await pages_2.default.getSingle({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
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
    schema: pages_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map