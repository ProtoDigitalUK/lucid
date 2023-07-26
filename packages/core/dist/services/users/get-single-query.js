"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
const User_1 = __importDefault(require("../../db/models/User"));
const getSingleQuery = async (client, data) => {
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "super_admin",
            "email",
            "username",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
            "password",
        ],
        exclude: undefined,
        filter: {
            data: {
                id: data.user_id?.toString() || undefined,
                email: data.email || undefined,
                username: data.username || undefined,
            },
            meta: {
                id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
                email: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                username: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    const user = await User_1.default.getSingle(client, SelectQuery);
    return user;
};
exports.default = getSingleQuery;
//# sourceMappingURL=get-single-query.js.map