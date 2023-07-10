"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = __importDefault(require("../../db/models/Email"));
const query_helpers_1 = require("../../utils/app/query-helpers");
const getMultiple = async (data) => {
    const { filter, sort, page, per_page } = data.query;
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
    const emails = await Email_1.default.getMultiple(SelectQuery);
    return emails;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map