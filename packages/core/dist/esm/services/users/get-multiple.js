import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import User from "../../db/models/User.js";
import formatUser from "../../utils/format/format-user.js";
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
    const SelectQuery = new SelectQueryBuilder({
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
    const users = await User.getMultiple(client, SelectQuery);
    return {
        data: users.data.map((user) => formatUser(user)),
        count: users.count,
    };
};
export default getMultiple;
//# sourceMappingURL=get-multiple.js.map