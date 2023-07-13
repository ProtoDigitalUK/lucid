"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class SinglePage {
}
_a = SinglePage;
SinglePage.getSingle = async (query_instance) => {
    const client = await db_1.default;
    const singlepage = await client.query({
        text: `SELECT
          ${query_instance.query.select}
        FROM
          lucid_singlepages
        ${query_instance.query.where}`,
        values: query_instance.values,
    });
    return singlepage.rows[0];
};
SinglePage.createSingle = async (data) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `INSERT INTO lucid_singlepages ( environment_key, collection_key, updated_by ) VALUES ($1, $2, $3) RETURNING *`,
        values: [data.environment_key, data.collection_key, data.user_id],
    });
    return res.rows[0];
};
SinglePage.updateSingle = async (data) => {
    const client = await db_1.default;
    const updateSinglePage = await client.query({
        text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
        values: [data.user_id, data.id],
    });
    return updateSinglePage.rows[0];
};
exports.default = SinglePage;
//# sourceMappingURL=SinglePage.js.map