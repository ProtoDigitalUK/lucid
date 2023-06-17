"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const body = zod_1.default.object({
    assigned_bricks: zod_1.default.array(zod_1.default.string()).optional(),
    assigned_collections: zod_1.default.array(zod_1.default.string()).optional(),
});
const query = zod_1.default.object({});
const params = zod_1.default.object({
    key: zod_1.default.string(),
});
const updateSingle = async (req, res, next) => {
    try {
        const environment = await Environment_1.default.upsertSingle({
            key: req.params.key,
            ...req.body,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: environment,
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
    controller: updateSingle,
};
//# sourceMappingURL=update-single.js.map