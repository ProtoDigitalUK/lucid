"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.query = exports.body = void 0;
const zod_1 = __importDefault(require("zod"));
exports.body = zod_1.default.object({});
exports.query = zod_1.default.object({});
exports.params = zod_1.default.object({});
const getHealth = async (req, res, next) => {
    try {
        res.status(200).json({
            health: {
                api: "ok",
                db: "ok",
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: {
        body: exports.body,
        query: exports.query,
        params: exports.params,
    },
    controller: getHealth,
};
//# sourceMappingURL=get-health.js.map