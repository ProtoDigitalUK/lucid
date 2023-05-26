"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
const body = zod_1.default.object({});
const query = zod_1.default.object({
    include: zod_1.default.array(zod_1.default.enum(["fields"])).optional(),
    filter: zod_1.default
        .object({
        s: zod_1.default.string(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["name"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
});
const params = zod_1.default.object({});
const getAll = async (req, res, next) => {
    try {
        const bricks = await BrickConfig_1.default.getAll(req, req.query);
        res.status(200).json((0, build_response_1.default)(req, {
            data: bricks,
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
    controller: getAll,
};
//# sourceMappingURL=get-all.js.map