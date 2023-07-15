"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const collections_1 = __importDefault(require("../collections"));
const createSingle = async (client, data) => {
    await (0, service_1.default)(collections_1.default.getSingle, false, client)({
        collection_key: data.collection_key,
        type: "pages",
        environment_key: data.environment_key,
    });
    const isSlugUnique = await Category_1.default.isSlugUniqueInCollection(client, {
        collection_key: data.collection_key,
        slug: data.slug,
        environment_key: data.environment_key,
    });
    if (!isSlugUnique) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Created",
            message: "Please provide a unique slug within this post type.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                slug: {
                    code: "not_unique",
                    message: "Please provide a unique slug within this post type.",
                },
            }),
        });
    }
    const category = await Category_1.default.createSingle(client, data);
    if (!category) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Created",
            message: "There was an error creating the category.",
            status: 500,
        });
    }
    return category;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map