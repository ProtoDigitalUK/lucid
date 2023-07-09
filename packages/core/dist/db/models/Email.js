"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const render_template_1 = __importDefault(require("../../utils/emails/render-template"));
const send_email_1 = require("../../utils/emails/send-email");
const error_handler_1 = require("../../utils/app/error-handler");
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
    if (email.rowCount === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Error saving email",
            status: 500,
        });
    }
    return email.rows[0];
};
Email.getMultiple = async (query) => {
    const client = await db_1.default;
    const { filter, sort, page, per_page } = query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "from_address",
            "from_name",
            "to_address",
            "subject",
            "cc",
            "bcc",
            "template",
            "data",
            "delivery_status",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: filter,
            meta: {
                to_address: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                subject: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                delivery_status: {
                    operator: "ILIKE",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const emails = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_emails
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_emails.id)
        FROM
          lucid_emails
        ${SelectQuery.query.where} `,
        values: SelectQuery.countValues,
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
    if (email.rowCount === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
    const html = await (0, render_template_1.default)(email.rows[0].template, email.rows[0].data || {});
    email.rows[0].html = html;
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
    if (email.rowCount === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
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
    const emailRes = await client.query({
        text: `UPDATE 
        lucid_emails 
        SET 
          ${columns.formatted.update} 
        WHERE 
          id = $${aliases.value.length + 1}
        RETURNING *`,
        values: [...values.value, id],
    });
    if (!emailRes.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error updating email",
            message: "There was an error updating the email",
            status: 500,
        });
    }
    return emailRes.rows[0];
};
Email.resendSingle = async (id) => {
    const email = await Email.getSingle(id);
    const status = await (0, send_email_1.sendEmailInternal)(email.template, {
        data: email.data || {},
        options: {
            to: email.to_address || "",
            subject: email.subject || "",
            from: email.from_address || undefined,
            fromName: email.from_name || undefined,
            cc: email.cc || undefined,
            bcc: email.bcc || undefined,
            replyTo: email.from_address || undefined,
        },
    }, id);
    const updatedEmail = await Email.getSingle(id);
    return {
        status,
        email: updatedEmail,
    };
};
exports.default = Email;
//# sourceMappingURL=Email.js.map