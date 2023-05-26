"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
const body = zod_1.default.object({});
const query = zod_1.default.object({});
const params = zod_1.default.object({
    key: zod_1.default.string().nonempty(),
});
const getSingle = async (req, res, next) => {
    try {
        const brick = await BrickConfig_1.default.getSingle(req, req.params.key);
        res.status(200).json((0, build_response_1.default)(req, {
            data: brick,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: {
        body,
        query,
        params,
    },
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map