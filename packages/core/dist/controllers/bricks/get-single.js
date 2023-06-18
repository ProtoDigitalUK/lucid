"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
const bricks_1 = __importDefault(require("../../schemas/bricks"));
const getSingle = async (req, res, next) => {
    try {
        const brick = await BrickConfig_1.default.getSingle(req.headers["lucid-environment"], req.params.key);
        res.status(200).json((0, build_response_1.default)(req, {
            data: brick,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: bricks_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map