"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Category_1 = __importDefault(require("../../db/models/Category"));
const categories_1 = __importDefault(require("../../schemas/categories"));
const getSingle = async (req, res, next) => {
    try {
        const category = await Category_1.default.getSingle(req.headers["lucid-environment"], parseInt(req.params.id));
        res.status(200).json((0, build_response_1.default)(req, {
            data: category,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: categories_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map