import { MenuT, MenuItemT } from "../../db/models/Menu";
import { ItemsRes } from "../menu";
declare const formatMenu: (menu: MenuT, items: MenuItemT[]) => {
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: ItemsRes[] | null;
};
export default formatMenu;
//# sourceMappingURL=format.d.ts.map