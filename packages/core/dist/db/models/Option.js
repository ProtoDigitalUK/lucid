"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class Option {
}
_a = Option;
Option.getByName = async (name) => {
    const client = await db_1.default;
    const options = await client.query({
        text: `SELECT * FROM lucid_options WHERE option_name = $1`,
        values: [name],
    });
    return options.rows[0];
};
Option.patchByName = async (data) => {
    const client = await db_1.default;
    const options = await client.query({
        text: `UPDATE lucid_options SET option_value = $1, type = $2, updated_at = NOW() WHERE option_name = $3 RETURNING *`,
        values: [data.value, data.type, data.name],
    });
    return options.rows[0];
};
exports.default = Option;
//# sourceMappingURL=Option.js.map