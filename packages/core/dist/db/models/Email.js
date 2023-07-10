"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class Email {
}
_a = Email;
Email.createSingle = async (data) => {
    const client = await db_1.default;
    const { from_address, from_name, to_address, subject, cc, bcc, template, delivery_status, data: templateData, } = data;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "from_address",
            "from_name",
            "to_address",
            "subject",
            "cc",
            "bcc",
            "template",
            "data",
            "delivery_status",
        ],
        values: [
            from_address,
            from_name,
            to_address,
            subject,
            cc,
            bcc,
            template,
            templateData,
            delivery_status,
        ],
    });
    const email = await client.query({
        text: `INSERT INTO lucid_emails (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return email.rows[0];
};
Email.getMultiple = async (query_instance) => {
    const client = await db_1.default;
    const emails = await client.query({
        text: `SELECT ${query_instance.query.select} FROM lucid_emails ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = await client.query({
        text: `SELECT  COUNT(DISTINCT lucid_emails.id) FROM lucid_emails ${query_instance.query.where}`,
        values: query_instance.countValues,
    });
    return {
        data: emails.rows,
        count: count.rows[0].count,
    };
};
Email.getSingle = async (id) => {
    const client = await db_1.default;
    const email = await client.query({
        text: `SELECT
          *
        FROM
          lucid_emails
        WHERE
          id = $1`,
        values: [id],
    });
    return email.rows[0];
};
Email.deleteSingle = async (id) => {
    const client = await db_1.default;
    const email = await client.query({
        text: `DELETE FROM
          lucid_emails
        WHERE
          id = $1
        RETURNING *`,
        values: [id],
    });
    return email.rows[0];
};
Email.updateSingle = async (id, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["from_address", "from_name", "delivery_status"],
        values: [data.from_address, data.from_name, data.delivery_status],
        conditional: {
            hasValues: {
                updated_at: new Date().toISOString(),
            },
        },
    });
    const email = await client.query({
        text: `UPDATE 
        lucid_emails 
        SET 
          ${columns.formatted.update} 
        WHERE 
          id = $${aliases.value.length + 1}
        RETURNING *`,
        values: [...values.value, id],
    });
    return email.rows[0];
};
exports.default = Email;
//# sourceMappingURL=Email.js.map