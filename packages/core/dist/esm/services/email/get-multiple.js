import Email from "../../db/models/Email.js";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
    const SelectQuery = new SelectQueryBuilder({
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
    const emails = await Email.getMultiple(client, SelectQuery);
    return emails;
};
export default getMultiple;
//# sourceMappingURL=get-multiple.js.map