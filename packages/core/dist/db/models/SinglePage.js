"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
class SinglePage {
}
_a = SinglePage;
SinglePage.getSingle = async (client, query_instance) => {
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
SinglePage.createSingle = async (client, data) => {
    const res = await client.query({
        text: `INSERT INTO lucid_singlepages ( environment_key, collection_key, updated_by ) VALUES ($1, $2, $3) RETURNING *`,
        values: [data.environment_key, data.collection_key, data.user_id],
    });
    return res.rows[0];
};
SinglePage.updateSingle = async (client, data) => {
    const updateSinglePage = await client.query({
        text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
        values: [data.user_id, data.id],
    });
    return updateSinglePage.rows[0];
};
exports.default = SinglePage;
//# sourceMappingURL=SinglePage.js.map