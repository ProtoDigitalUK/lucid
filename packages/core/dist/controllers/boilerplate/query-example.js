"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const body = zod_1.default.object({});
const query = zod_1.default.object({
    include: zod_1.default.array(zod_1.default.enum(["fields"])),
    exclude: zod_1.default.undefined(),
    filter: zod_1.default.object({
        s: zod_1.default.string(),
    }),
    sort: zod_1.default.array(zod_1.default.object({
        key: zod_1.default.enum(["id", "name"]),
        value: zod_1.default.enum(["asc", "desc"]),
    })),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const params = zod_1.default.object({});
const queryExample = async (req, res, next) => {
    try {
        res.status(200).json((0, build_response_1.default)(req, {
            data: {
                message: "Hello World!",
            },
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
    controller: queryExample,
};
//# sourceMappingURL=query-example.js.map