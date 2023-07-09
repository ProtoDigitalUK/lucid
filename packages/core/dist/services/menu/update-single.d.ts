import { MenuItemUpdate } from "../../schemas/menus";
export interface ServiceData {
    environment_key: string;
    id: number;
    key?: string;
    name?: string;
    description?: string;
    items?: MenuItemUpdate[];
}
declare const getSingle: (data: ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
export default getSingle;
//# sourceMappingURL=update-single.d.ts.map