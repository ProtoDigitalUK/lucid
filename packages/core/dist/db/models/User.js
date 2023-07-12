"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class User {
}
_a = User;
User.register = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["email", "username", "password", "super_admin"],
        values: [data.email, data.username, data.password, data.super_admin],
    });
    const user = await client.query({
        text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return user.rows[0];
};
User.getById = async (id) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `SELECT * FROM lucid_users WHERE id = $1`,
        values: [id],
    });
    return user.rows[0];
};
User.getByUsername = async (data) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `SELECT * FROM lucid_users WHERE username = $1`,
        values: [data.username],
    });
    return user.rows[0];
};
User.checkIfUserExistsAlready = async (email, username) => {
    const client = await db_1.default;
    const userExists = await client.query({
        text: `SELECT * FROM lucid_users WHERE email = $1 OR username = $2`,
        values: [email, username],
    });
    return userExists.rows[0];
};
exports.default = User;
//# sourceMappingURL=User.js.map