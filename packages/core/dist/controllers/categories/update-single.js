"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const categories_1 = __importDefault(require("../../schemas/categories"));
const categories_2 = __importDefault(require("../../services/categories"));
const updateSingleController = async (req, res, next) => {
    try {
        const category = await categories_2.default.updateSingle({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
            data: {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
            },
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
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map