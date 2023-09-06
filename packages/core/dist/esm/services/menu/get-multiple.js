import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import service from "../../utils/app/service.js";
import Menu from "../../db/models/Menu.js";
import menuServices from "../menu/index.js";
import formatMenu from "../../utils/format/format-menu.js";
const getMultiple = async (client, data) => {
    const { filter, sort, include, page, per_page } = data.query;
    const SelectQuery = new SelectQueryBuilder({
        columns: [
            "id",
            "key",
            "environment_key",
            "name",
            "description",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: {
                ...filter,
                environment_key: data.environment_key,
            },
            meta: {
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                environment_key: {
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
    const menus = await Menu.getMultiple(client, SelectQuery);
    let menuItems = [];
    if (include && include.includes("items")) {
        menuItems = await service(menuServices.getItems, false, client)({
            menu_ids: menus.data.map((menu) => menu.id),
        });
    }
    return {
        data: menus.data.map((menu) => formatMenu(menu, menuItems)),
        count: menus.count,
    };
};
export default getMultiple;
//# sourceMappingURL=get-multiple.js.map