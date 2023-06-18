"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Category_1 = __importDefault(require("../../db/models/Category"));
const categories_1 = __importDefault(require("../../schemas/categories"));
const getMultiple = async (req, res, next) => {
    try {
        const categories = await Category_1.default.getMultiple(req.headers["lucid-environment"], req.query);
        res.status(200).json((0, build_response_1.default)(req, {
            data: categories.data,
            pagination: {
                count: categories.count,
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
    controller: getMultiple,
};
//# sourceMappingURL=get-multiple.js.map