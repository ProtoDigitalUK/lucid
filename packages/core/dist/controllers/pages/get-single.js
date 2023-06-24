"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const pages_1 = __importDefault(require("../../schemas/pages"));
const getSingle = async (req, res, next) => {
    try {
        const page = await Page_1.default.getSingle(req.query, {
            environment_key: req.headers["lucid-environment"],
            id: req.params.id,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map