"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const pages_js_1 = __importDefault(require("../../schemas/pages.js"));
const index_js_1 = __importDefault(require("../../services/pages/index.js"));
const getMultipleController = async (req, res, next) => {
    try {
        const pagesRes = await (0, service_js_1.default)(index_js_1.default.getMultiple, false)({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: pagesRes.data,
            pagination: {
                count: pagesRes.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_js_1.default.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map