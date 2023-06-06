"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const body = zod_1.default.object({});
const query = zod_1.default.object({});
const params = zod_1.default.object({
    id: zod_1.default.string(),
});
const getSingle = async (req, res, next) => {
    try {
        const page = await Page_1.default.getSingle(req.params.id, req);
        res.status(200).json((0, build_response_1.default)(req, {
            data: page,
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