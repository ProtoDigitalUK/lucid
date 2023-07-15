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
        columns: [
            "email",
            "username",
            "password",
            "super_admin",
            "first_name",
            "last_name",
        ],
        values: [
            data.email,
            data.username,
            data.password,
            data.super_admin,
            data.first_name,
            data.last_name,
        ],
    });
    const user = await client.query({
        text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return user.rows[0];
};
User.getMultiple = async (query_instance) => {
    const client = await db_1.default;
    const users = client.query({
        text: `SELECT ${query_instance.query.select} FROM lucid_users ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = client.query({
        text: `SELECT COUNT(DISTINCT lucid_users.id) FROM lucid_users ${query_instance.query.where}`,
        values: query_instance.countValues,
    });
    const data = await Promise.all([users, count]);
    return {
        data: data[0].rows,
        count: parseInt(data[1].rows[0].count),
    };
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
User.getByEmail = async (data) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `SELECT * FROM lucid_users WHERE email = $1`,
        values: [data.email],
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
User.deleteSingle = async (id) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `DELETE FROM lucid_users WHERE id = $1 RETURNING *`,
        values: [id],
    });
    return user.rows[0];
};
User.updatePassword = async (id, password) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `UPDATE lucid_users SET password = $1 WHERE id = $2 RETURNING *`,
        values: [password, id],
    });
    return user.rows[0];
};
exports.default = User;
//# sourceMappingURL=User.js.map