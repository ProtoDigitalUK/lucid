"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Category_js_1 = __importDefault(require("../../db/models/Category.js"));
const index_js_1 = __importDefault(require("../categories/index.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const updateSingle = async (client, data) => {
    const currentCategory = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        environment_key: data.environment_key,
        id: data.id,
    });
    if (data.data.slug) {
        const isSlugUnique = await Category_js_1.default.isSlugUniqueInCollection(client, {
            collection_key: currentCategory.collection_key,
            slug: data.data.slug,
            environment_key: data.environment_key,
            ignore_id: data.id,
        });
        if (!isSlugUnique) {
            throw new error_handler_js_1.LucidError({
                type: "basic",
                name: "Category Not Updated",
                message: "Please provide a unique slug within this post type.",
                status: 400,
                errors: (0, error_handler_js_1.modelErrors)({
                    slug: {
                        code: "not_unique",
                        message: "Please provide a unique slug within this post type.",
                    },
                }),
            });
        }
    }
    return await Category_js_1.default.updateSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
        title: data.data.title,
        slug: data.data.slug,
        description: data.data.description,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map