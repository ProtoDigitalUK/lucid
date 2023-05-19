"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const sample_json_1 = __importDefault(require("../../data/sample.json"));
const body = zod_1.default.object({});
const query = zod_1.default.object({
    include: zod_1.default.string().optional(),
    exclude: zod_1.default.string().optional(),
    filter: zod_1.default
        .object({
        id: zod_1.default.string().optional(),
        active: zod_1.default.enum(["1", "-1"]).optional(),
    })
        .optional(),
    sort: zod_1.default.string().optional(),
});
const params = zod_1.default.object({
    id: zod_1.default.string(),
});
const getSingle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = sample_json_1.default.find((item) => item.id.toString() === id);
        res.status(200).json({
            data: data,
            query: req.query,
        });
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