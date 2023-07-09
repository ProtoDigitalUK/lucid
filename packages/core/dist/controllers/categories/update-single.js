"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Category_1 = __importDefault(require("../../db/models/Category"));
const categories_1 = __importDefault(require("../../schemas/categories"));
const updateSingle = async (req, res, next) => {
    try {
        const category = await Category_1.default.update(req.headers["lucid-environment"], parseInt(req.params.id), {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: category,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: categories_1.default.updateSingle,
    controller: updateSingle,
};
//# sourceMappingURL=update-single.js.map