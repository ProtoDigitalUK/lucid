import z from "zod";
import menusSchema from "../../schemas/menus";
export interface ServiceData {
    query: z.infer<typeof menusSchema.getMultiple.query>;
    environment_key: string;
}
declare const getMultiple: (data: ServiceData) => Promise<{
    data: {
        id: number;
        key: string;
        environment_key: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        items: import("../menu").ItemsRes[] | null;
    }[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map