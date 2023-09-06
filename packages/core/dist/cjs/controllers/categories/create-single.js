"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const categories_js_1 = __importDefault(require("../../schemas/categories.js"));
const index_js_1 = __importDefault(require("../../services/categories/index.js"));
const createSingleControllers = async (req, res, next) => {
    try {
        const category = await (0, service_js_1.default)(index_js_1.default.createSingle, true)({
            environment_key: req.headers["lucid-environment"],
            collection_key: req.body.collection_key,
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: category,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: categories_js_1.default.createSingle,
    controller: createSingleControllers,
};
//# sourceMappingURL=create-single.js.map