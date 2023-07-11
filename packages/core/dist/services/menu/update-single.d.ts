import { MenuItemUpdate } from "../../schemas/menus";
export interface ServiceData {
    environment_key: string;
    id: number;
    key?: string;
    name?: string;
    description?: string;
    items?: MenuItemUpdate[];
}
declare const updateSingle: (data: ServiceData) => Promise<{
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: import("../menu").ItemsRes[] | null;
}>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map