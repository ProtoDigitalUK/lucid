import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import Media from "../../db/models/Media.js";
import formatMedia from "../../utils/format/format-media.js";
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
    const SelectQuery = new SelectQueryBuilder({
        columns: [
            "id",
            "key",
            "e_tag",
            "type",
            "name",
            "alt",
            "mime_type",
            "file_extension",
            "file_size",
            "width",
            "height",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: filter,
            meta: {
                type: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                key: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                mime_type: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                file_extension: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const mediasRes = await Media.getMultiple(client, SelectQuery);
    return {
        data: mediasRes.data.map((media) => formatMedia(media)),
        count: mediasRes.count,
    };
};
export default getMultiple;
//# sourceMappingURL=get-multiple.js.map