"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_js_1 = require("../../utils/app/query-helpers.js");
const User_js_1 = __importDefault(require("../../db/models/User.js"));
const format_user_js_1 = __importDefault(require("../../utils/format/format-user.js"));
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
    const SelectQuery = new query_helpers_js_1.SelectQueryBuilder({
        columns: [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "created_at",
            "super_admin",
        ],
        exclude: undefined,
        filter: {
            data: filter,
            meta: {
                email: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                username: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                first_name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                last_name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const users = await User_js_1.default.getMultiple(client, SelectQuery);
    return {
        data: users.data.map((user) => (0, format_user_js_1.default)(user)),
        count: users.count,
    };
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map