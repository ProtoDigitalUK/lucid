"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const body = zod_1.default.object({});
const query = zod_1.default.object({
    include: zod_1.default.string().optional(),
    exclude: zod_1.default.string().optional(),
    filter: zod_1.default
        .object({
        search: zod_1.default.string().optional(),
        active: zod_1.default.enum(["-1", "1"]).optional(),
    })
        .optional(),
    sort: zod_1.default.string().optional(),
});
const params = zod_1.default.object({});
const queryExample = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Hello World!",
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
    controller: queryExample,
};
//# sourceMappingURL=query-example.js.map