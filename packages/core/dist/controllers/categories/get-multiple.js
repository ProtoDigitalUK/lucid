"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const categories_1 = __importDefault(require("../../schemas/categories"));
const categories_2 = __importDefault(require("../../services/categories"));
const getMultipleController = async (req, res, next) => {
    try {
        const categoriesRes = await (0, service_1.default)(categories_2.default.getMultiple, false)({
            environment_key: req.headers["lucid-environment"],
            query: req.query,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: categoriesRes.data,
            pagination: {
                count: categoriesRes.count,
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
    schema: categories_1.default.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map