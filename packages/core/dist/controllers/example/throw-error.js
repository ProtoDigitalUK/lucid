"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("../../utils/error-handler");
const sample_json_1 = __importDefault(require("../../data/sample.json"));
const body = zod_1.default.object({
    name: zod_1.default.string().min(2),
    active: zod_1.default.boolean(),
    items: zod_1.default.array(zod_1.default.object({ id: zod_1.default.string(), name: zod_1.default.string() })).length(3),
    person: zod_1.default.object({
        name: zod_1.default.string().min(2),
        age: zod_1.default.number().min(18),
    }),
});
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
const params = zod_1.default.object({});
const throwError = async (req, res, next) => {
    try {
        const data = sample_json_1.default.find((item) => item.id.toString() === "1");
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Test Error",
            message: "This is a test error",
            status: 500,
        });
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
    controller: throwError,
};
//# sourceMappingURL=throw-error.js.map