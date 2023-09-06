"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Option {
    static getByName = async (client, data) => {
        const options = await client.query({
            text: `SELECT * FROM lucid_options WHERE option_name = $1`,
            values: [data.name],
        });
        return options.rows[0];
    };
    static patchByName = async (client, data) => {
        const options = await client.query({
            text: `UPDATE lucid_options SET option_value = $1, type = $2, updated_at = NOW() WHERE option_name = $3 RETURNING *`,
            values: [data.value, data.type, data.name],
        });
        return options.rows[0];
    };
}
exports.default = Option;
//# sourceMappingURL=Option.js.map