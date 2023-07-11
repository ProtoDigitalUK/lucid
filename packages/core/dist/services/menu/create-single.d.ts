import { MenuItem } from "../../schemas/menus";
export interface ServiceData {
    environment_key: string;
    key: string;
    name: string;
    description?: string;
    items?: MenuItem[];
}
declare const createSingle: (data: ServiceData) => Promise<{
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: import("../menu").ItemsRes[] | null;
}>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map