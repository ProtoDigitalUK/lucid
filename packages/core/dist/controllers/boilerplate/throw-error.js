"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("@utils/error-handler");
const body = zod_1.default.object({});
const query = zod_1.default.object({
    include: zod_1.default.string().optional(),
    exclude: zod_1.default.string().optional(),
    filter: zod_1.default.object({}).optional(),
    sort: zod_1.default.string().optional(),
});
const params = zod_1.default.object({});
const throwError = async (req, res, next) => {
    try {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Test Error",
            message: "This is a test error",
            status: 500,
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