"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const Config_1 = __importDefault(require("../../services/Config"));
class PostType {
}
_a = PostType;
PostType.getAll = async () => {
    const configPostTypes = Config_1.default.postTypes;
    const returnKeys = [
        "page",
        ...configPostTypes.map((postType) => postType.key),
    ];
    const postTypes = await db_1.default.query({
        text: `SELECT * FROM lucid_post_types WHERE key = ANY($1)`,
        values: [returnKeys],
    });
    return postTypes.rows;
};
PostType.createOrUpdate = async (postType) => {
    const res = await db_1.default.query({
        text: `INSERT INTO lucid_post_types (key, name, singular_name)
          VALUES ($1, $2, $3)
          ON CONFLICT (key) DO UPDATE SET name = $2, singular_name = $3
          RETURNING *`,
        values: [postType.key, postType.name, postType.singular_name],
    });
    if (!res.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Post Type Error",
            message: "There was an error creating the post type.",
            status: 500,
        });
    }
    return res.rows[0];
};
exports.default = PostType;
//# sourceMappingURL=PostType.js.map